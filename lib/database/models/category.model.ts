import { Document, Schema, model, models } from "mongoose";

export interface ICategory extends Document {
  find(arg0: (cat: any) => boolean): unknown;
  find(arg0: (cat: any) => boolean): unknown;
  find(arg0: (cat: any) => boolean): unknown;
  find(arg0: (cat: any) => boolean): unknown;
  
  adCount: number;
  _id: string;
  name: string;
  subcategory: Subcategory[];
  imageUrl: string;
}
export interface Subcategory {
  title: string;
}
const SubcategorySchema = new Schema<Subcategory>({
  title: { type: String, required: true },
});
const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  subcategory: [SubcategorySchema],
  imageUrl: { type: String, required: true },
})

const Category = models.Category || model('Category', CategorySchema);

export default Category;