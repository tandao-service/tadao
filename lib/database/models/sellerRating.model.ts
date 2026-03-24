import { Schema, model, models } from "mongoose";

const SellerRatingSchema = new Schema(
    {
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        ad: {
            type: Schema.Types.ObjectId,
            ref: "DynamicAd",
            default: null,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            trim: true,
            maxlength: 500,
            default: "",
        },
    },
    { timestamps: true }
);

SellerRatingSchema.index({ seller: 1, reviewer: 1 }, { unique: true });

export default models.SellerRating || model("SellerRating", SellerRatingSchema);