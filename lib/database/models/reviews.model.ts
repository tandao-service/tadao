import { Document, Schema, Types, model, models } from "mongoose";

export interface IReported extends Document {
  _id: Types.ObjectId;
  userId: string;
  adId: string;
  reason: string;
  description: string;
}
const ReportedSchema = new Schema({
  adId: { type: Schema.Types.ObjectId, ref: 'Ad' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, required: true },
  description: { type: String, required: true },
},
  { timestamps: true })
const Reported = models.Reported || model('Reported', ReportedSchema);

export default Reported;