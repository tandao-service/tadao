import { Schema, model, models, Document, Types } from "mongoose";
export interface IPackages
  extends Document {
  _id: any;
  name: string;
  description: string;
  features: Feature[];
  price: Price[];
  imageUrl: string;
  color: string;
  priority: number;
  list: number;
  entitlements: any;
}

export interface Feature {
  title: string;
  checked: boolean;
}
export interface Price {
  period: string;
  amount: number;
}

const PriceSchema = new Schema<Price>(
  {
    period: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { _id: true }
);

const FeatureSchema = new Schema<Feature>(
  {
    title: { type: String, required: true },
    checked: { type: Boolean, default: false },
  },
  { _id: true }
);

const EntitlementsSchema = new Schema(
  {
    maxListings: { type: Number, default: 0 },      // same as list
    priority: { type: Number, default: 0 },         // same as priority
    topDays: { type: Number, default: 0 },          // TOP duration after posting
    featuredDays: { type: Number, default: 0 },     // Featured duration after posting
    autoRenewHours: { type: Number, default: null },// 24, 12, null
  },
  { _id: false }
);

const PackagesSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },

    features: { type: [FeatureSchema], default: [] },

    price: { type: [PriceSchema], default: [] },
    price2: { type: [PriceSchema], default: [] },

    imageUrl: { type: String, required: true },
    color: { type: String, required: true },

    // You can keep these, but ideally mirror entitlements values
    priority: { type: Number, required: true },
    list: { type: Number, required: true },

    // ✅ machine-readable
    entitlements: { type: EntitlementsSchema, default: () => ({}) },
  },
  { timestamps: false }
);

const Packages = models.Packages || model("Packages", PackagesSchema);
export default Packages;