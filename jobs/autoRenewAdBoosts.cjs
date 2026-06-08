require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
}

let cached = false;

async function connectMongo() {
    if (cached && mongoose.connection.readyState === 1) return;

    await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
    });

    cached = true;
    console.log("MongoDB connected");
}

const UserSchema = new mongoose.Schema(
    {
        subscription: {
            planId: { type: mongoose.Schema.Types.ObjectId, ref: "Packages", default: null },
            planName: { type: String, default: "" },
            active: { type: Boolean, default: false },
            expiresAt: { type: Date, default: null },
            remainingAds: { type: Number, default: 0 },
            entitlements: {
                maxListings: { type: Number, default: 0 },
                priority: { type: Number, default: 0 },
                topDays: { type: Number, default: 0 },
                featuredDays: { type: Number, default: 0 },
                autoRenewHours: { type: Number, default: null },
            },
            createdAt: { type: Date, default: Date.now },
        },
    },
    { timestamps: false }
);

const BidSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: String,
        timestamp: { type: Date, default: Date.now },
        isWinner: { type: Boolean, default: false },
        isAbusive: { type: Boolean, default: false },
    },
    { _id: false }
);

const DynamicAdSchema = new mongoose.Schema(
    {
        data: mongoose.Schema.Types.Mixed,
        views: { type: String },
        priority: { type: Number },
        expirely: { type: Date },
        adstatus: { type: String },
        inquiries: { type: String },
        whatsapp: { type: String },
        calls: { type: String },
        shared: { type: String },
        bookmarked: { type: String },
        abused: { type: String },
        subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
        organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        plan: { type: mongoose.Schema.Types.ObjectId, ref: "Packages" },
        biddingEnabled: { type: Boolean, default: false },
        biddingEndsAt: { type: Date },
        bidIncrement: { type: Number, default: 100 },
        bids: [BidSchema],
        createdAt: { type: Date, default: Date.now },
        boost: {
            isTop: { type: Boolean, default: false },
            topUntil: { type: Date, default: null },
            isFeatured: { type: Boolean, default: false },
            featuredUntil: { type: Date, default: null },
            autoRenewHours: { type: Number, default: null },
            lastAutoRenewedAt: { type: Date, default: null },
        },
    },
    { timestamps: false }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const DynamicAd = mongoose.models.DynamicAd || mongoose.model("DynamicAd", DynamicAdSchema);

function toDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isFinite(d.getTime()) ? d : null;
}

function addDays(from, days) {
    return new Date(from.getTime() + days * 24 * 60 * 60 * 1000);
}

function addHours(from, hours) {
    return new Date(from.getTime() + hours * 60 * 60 * 1000);
}

function getSubscriptionSnapshot(user) {
    const sub = user?.subscription || {};
    const now = new Date();
    const expiresAt = toDate(sub?.expiresAt);
    const expired = !sub?.active || !expiresAt || expiresAt.getTime() <= now.getTime();

    return {
        active: Boolean(sub?.active) && !expired,
        expired,
        entitlements: {
            priority: Number(sub?.entitlements?.priority ?? 0),
            topDays: Number(sub?.entitlements?.topDays ?? 0),
            featuredDays: Number(sub?.entitlements?.featuredDays ?? 0),
            autoRenewHours:
                sub?.entitlements?.autoRenewHours == null
                    ? null
                    : Number(sub.entitlements.autoRenewHours),
        },
    };
}

function shouldSkipDuplicateRenewal(lastAutoRenewedAt, autoRenewHours, now) {
    if (!autoRenewHours || autoRenewHours <= 0) return false;
    if (!lastAutoRenewedAt) return false;

    const nextAllowedAt = addHours(lastAutoRenewedAt, autoRenewHours);
    return nextAllowedAt.getTime() > now.getTime();
}

async function disableAdBoosts(adId, reason) {
    await DynamicAd.updateOne(
        { _id: adId },
        {
            $set: {
                "boost.isTop": false,
                "boost.topUntil": null,
                "boost.isFeatured": false,
                "boost.featuredUntil": null,
                "boost.autoRenewHours": null,
            },
        }
    );

    console.log("Disabled ad boosts", {
        adId: String(adId),
        reason,
    });
}

async function renewAdBoosts(ad, user) {
    const now = new Date();
    const sub = getSubscriptionSnapshot(user);

    if (!sub.active) {
        await disableAdBoosts(
            ad._id,
            sub.expired ? "subscription_expired" : "subscription_inactive"
        );

        return {
            renewedTop: false,
            renewedFeatured: false,
            disabled: true,
            skippedDuplicate: false,
        };
    }

    const autoRenewHours =
        sub.entitlements.autoRenewHours == null
            ? ad?.boost?.autoRenewHours ?? null
            : sub.entitlements.autoRenewHours;

    if (!autoRenewHours || autoRenewHours <= 0) {
        return {
            renewedTop: false,
            renewedFeatured: false,
            disabled: false,
            skippedDuplicate: false,
        };
    }

    const lastAutoRenewedAt = toDate(ad?.boost?.lastAutoRenewedAt);

    if (shouldSkipDuplicateRenewal(lastAutoRenewedAt, autoRenewHours, now)) {
        return {
            renewedTop: false,
            renewedFeatured: false,
            disabled: false,
            skippedDuplicate: true,
        };
    }

    const topUntil = toDate(ad?.boost?.topUntil);
    const featuredUntil = toDate(ad?.boost?.featuredUntil);

    const topExpired =
        Boolean(ad?.boost?.isTop) && (!topUntil || topUntil.getTime() <= now.getTime());

    const featuredExpired =
        Boolean(ad?.boost?.isFeatured) &&
        (!featuredUntil || featuredUntil.getTime() <= now.getTime());

    const update = {};
    let renewedTop = false;
    let renewedFeatured = false;

    if (topExpired) {
        if (sub.entitlements.topDays > 0) {
            update["boost.isTop"] = true;
            update["boost.topUntil"] = addDays(now, sub.entitlements.topDays);
            renewedTop = true;
        } else {
            update["boost.isTop"] = false;
            update["boost.topUntil"] = null;
        }
    }

    if (featuredExpired) {
        if (sub.entitlements.featuredDays > 0) {
            update["boost.isFeatured"] = true;
            update["boost.featuredUntil"] = addDays(now, sub.entitlements.featuredDays);
            renewedFeatured = true;
        } else {
            update["boost.isFeatured"] = false;
            update["boost.featuredUntil"] = null;
        }
    }

    if (renewedTop || renewedFeatured) {
        update["boost.autoRenewHours"] = autoRenewHours;
        update["boost.lastAutoRenewedAt"] = now;
        update.priority = Math.max(
            Number(ad?.priority ?? 0),
            Number(sub.entitlements.priority ?? 0)
        );

        await DynamicAd.updateOne({ _id: ad._id }, { $set: update });

        console.log("Renewed ad boosts", {
            adId: String(ad._id),
            renewedTop,
            renewedFeatured,
            topUntil: update["boost.topUntil"] || null,
            featuredUntil: update["boost.featuredUntil"] || null,
            autoRenewHours,
        });
    }

    return {
        renewedTop,
        renewedFeatured,
        disabled: false,
        skippedDuplicate: false,
    };
}

async function main() {
    await connectMongo();

    const now = new Date();

    console.log("Starting ad auto-renew job", {
        at: now.toISOString(),
    });

    const ads = await DynamicAd.find({
        adstatus: { $in: ["Active", "Pending", "Published"] },
        expirely: { $gt: now },
        "boost.autoRenewHours": { $ne: null },
        $or: [{ "boost.isTop": true }, { "boost.isFeatured": true }],
    })
        .select("_id organizer priority boost adstatus expirely")
        .lean();

    let scanned = 0;
    let renewedTopCount = 0;
    let renewedFeaturedCount = 0;
    let disabledCount = 0;
    let skippedDuplicateCount = 0;
    let missingUserCount = 0;
    let erroredCount = 0;

    for (const ad of ads) {
        scanned += 1;

        try {
            const user = await User.findById(ad.organizer).select("subscription").lean();

            if (!user) {
                missingUserCount += 1;
                await disableAdBoosts(ad?._id, "missing_user");
                continue;
            }

            const result = await renewAdBoosts(ad, user);

            if (result.renewedTop) renewedTopCount += 1;
            if (result.renewedFeatured) renewedFeaturedCount += 1;
            if (result.disabled) disabledCount += 1;
            if (result.skippedDuplicate) skippedDuplicateCount += 1;
        } catch (error) {
            erroredCount += 1;
            console.error("Failed processing ad auto-renew", {
                adId: String(ad._id),
                error: error?.message || String(error),
            });
        }
    }

    const expiredUsers = await User.find({
        $or: [
            { "subscription.active": false },
            { "subscription.expiresAt": { $lte: now } },
            { "subscription.expiresAt": null },
        ],
    })
        .select("_id")
        .lean();

    const expiredUserIds = expiredUsers.map((u) => u._id);

    if (expiredUserIds.length) {
        const cleanupRes = await DynamicAd.updateMany(
            {
                organizer: { $in: expiredUserIds },
                $or: [{ "boost.isTop": true }, { "boost.isFeatured": true }],
            },
            {
                $set: {
                    "boost.isTop": false,
                    "boost.topUntil": null,
                    "boost.isFeatured": false,
                    "boost.featuredUntil": null,
                    "boost.autoRenewHours": null,
                },
            }
        );

        disabledCount += cleanupRes.modifiedCount ?? 0;
    }

    console.log("Completed ad auto-renew job", {
        scanned,
        renewedTopCount,
        renewedFeaturedCount,
        disabledCount,
        skippedDuplicateCount,
        missingUserCount,
        erroredCount,
    });

    await mongoose.disconnect();
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(async (error) => {
        console.error("Auto-renew job failed", error?.message || error);

        try {
            await mongoose.disconnect();
        } catch (_) { }

        process.exit(1);
    });