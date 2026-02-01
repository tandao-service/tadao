import { Document, Schema, Types, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  userBId: string;
  adId: string;
}
const BookmarkSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'Ad' },
  userBId: { type: Schema.Types.ObjectId, ref: 'User' },
})
const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;