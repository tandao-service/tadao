import { Schema, model, models, Document } from 'mongoose'

export interface IPackages
  extends Document {
  _id: string;
  name: string;
  description: string;
  features: Feature[];
  price: Price[];
  imageUrl: string;
  color: string;
  priority: number;
  list: number;
  price2: Price[];
}
export interface Feature {
  title: string;
  checked: boolean;
}
export interface Price {
  period: string;
  amount: number;
}
const PriceSchema = new Schema<Price>({
  period: { type: String, required: true },
  amount: { type: Number, required: false }
});
// Define the schema for a single feature
const FeatureSchema = new Schema<Feature>({
  title: { type: String, required: true },
  checked: { type: Boolean, default: false }
});
const PackagesSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  features: [FeatureSchema],
  price: [PriceSchema],
  imageUrl: { type: String, required: true },
  color: { type: String, required: true },
  priority: { type: Number, required: true },
  list: { type: Number, required: true },
})
//var address = Schema({title: string, checked: boolean});
const Packages = models.Packages || model('Packages', PackagesSchema)

export default Packages
