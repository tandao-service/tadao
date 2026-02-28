// lib/validator.ts
import * as z from "zod";

/* =========================================================
   Shared helpers
========================================================= */

// Regular expression to match YouTube URLs
const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const numFromStringOrNumber = (label: string) =>
  z
    .union([z.string(), z.number()])
    .refine(
      (v) =>
        !isNaN(
          Number(typeof v === "string" ? v.replace(/,/g, "") : v)
        ),
      { message: `${label} must be a valid number` }
    )
    .transform((v) =>
      Number(typeof v === "string" ? v.replace(/,/g, "") : v)
    );

/* =========================================================
   Ad Form Schema
========================================================= */

export const AdFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),

  imageUrls: z.array(z.string()).min(3, "At least 3 images are required"),

  youtube: z
    .string()
    .refine((value) => value === "" || youtubeRegex.test(value), {
      message: "Invalid YouTube URL or video ID",
    })
    .optional(),

  phone: z.string(),
  subcategory: z.string(),
  views: z.string(),
  categoryId: z.string(),

  price: z
    .union([z.string(), z.number()])
    .refine(
      (value) =>
        !isNaN(
          Number(
            typeof value === "string"
              ? value.replace(/,/g, "")
              : value
          )
        ),
      { message: "Price must be a valid number" }
    )
    .transform((value) =>
      Number(typeof value === "string" ? value.replace(/,/g, "") : value)
    ),

  negotiable: z.boolean(),
  latitude: z.string(),
  longitude: z.string(),
  address: z.string(),
  enableMap: z.boolean(),

  make: z.string().optional(),
  vehiclemodel: z.string().optional(),
  vehicleyear: z.string().optional(),
  vehiclecolor: z.string().optional(),
  vehicleinteriorColor: z.string().optional(),
  vehiclecondition: z.string().optional(),
  vehiclesecordCondition: z.string().optional(),
  vehicleTransmissions: z.string().optional(),
  vehiclemileage: z.string().optional(),
  vehiclekeyfeatures: z.array(z.string()).optional(),
  vehiclechassis: z.string().optional(),
  vehicleregistered: z.string().optional(),
  vehicleexchangeposible: z.string().optional(),
  vehicleFuelTypes: z.string().optional(),
  vehicleBodyTypes: z.string().optional(),
  vehicleSeats: z.string().optional(),
  vehicleEngineSizesCC: z.string().optional(),

  Types: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  furnishing: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  toilets: z.string().optional(),
  parking: z.string().optional(),
  status: z.string().optional(),
  area: z.string().optional(),
  landuse: z.string().optional(),
  listedby: z.string().optional(),
  fee: z.string().optional(),
  propertysecurity: z.string().optional(),
  floors: z.string().optional(),
  estatename: z.string().optional(),
  houseclass: z.string().optional(),
});

/* =========================================================
   Category Form Schema
========================================================= */

const SubcategorySchema = z.object({
  title: z.string(),
});

export const CategoryFormSchema = z.object({
  name: z.string().min(3, "Category Name must be at least 3 characters"),
  subcategory: z.array(SubcategorySchema),
  imageUrl: z.string(),
});

/* =========================================================
   User Form Schema
========================================================= */

const BusinesshoursSchema = z.object({
  openHour: z.string(),
  openMinute: z.string(),
  closeHour: z.string(),
  closeMinute: z.string(),
});

const VerifiedSchema = z.object({
  accountverified: z.boolean(),
  verifieddate: z.date(),
});

export const UserFormSchema = z.object({
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photo: z.string(),

  businessname: z.string().optional(),
  aboutbusiness: z
    .string()
    .min(3, "About business must be at least 3 characters")
    .max(400, "About business must be less than 400 characters")
    .optional(),

  businessaddress: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  businesshours: z.array(BusinesshoursSchema).optional(),
  businessworkingdays: z.array(z.string()).optional(),

  phone: z.string().optional(),
  whatsapp: z.string().optional(),

  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  tiktok: z.string().url().optional(),

  // verified: z.array(VerifiedSchema).optional(), // keep commented if you're not using it
  imageUrl: z.string().optional(),
});

/* =========================================================
   Package Form Schema (UPDATED for new upgrade)
========================================================= */

const FeatureSchema = z.object({
  title: z.string(),
  checked: z.boolean().default(false),
});

const PriceSchema = z.object({
  period: z.string().min(1, "Period is required"),
  amount: numFromStringOrNumber("Amount").default(0),
});

// ✅ NEW: entitlements
const EntitlementsSchema = z.object({
  maxListings: numFromStringOrNumber("Max listings").default(0),
  priority: numFromStringOrNumber("Entitlement priority").default(0),
  topDays: numFromStringOrNumber("Top days").default(0),
  featuredDays: numFromStringOrNumber("Featured days").default(0),
  autoRenewHours: z
    .union([z.literal(""), z.null(), z.string(), z.number()])
    .transform((v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(typeof v === "string" ? v.replace(/,/g, "") : v);
      return Number.isFinite(n) ? n : null;
    })
    .default(null),
});

export const packageFormSchema = z.object({
  name: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(400, "Description must be less than 400 characters"),

  features: z.array(FeatureSchema).default([]),

  // ✅ both price lists
  price: z.array(PriceSchema).default([]),
  price2: z.array(PriceSchema).default([]),

  imageUrl: z.string(),
  color: z.string(),

  // legacy fields (kept for backwards compatibility)
  priority: numFromStringOrNumber("Priority").default(0),
  list: numFromStringOrNumber("List").default(0),

  // ✅ machine-readable upgrade
  entitlements: EntitlementsSchema.default({
    maxListings: 0,
    priority: 0,
    topDays: 0,
    featuredDays: 0,
    autoRenewHours: null,
  }),
});

/* =========================================================
   Verifies Form Schema
========================================================= */

export const VerifiesFormSchema = z.object({
  fee: z.string(),
});