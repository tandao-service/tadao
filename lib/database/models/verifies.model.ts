import { Schema, model, models, Document, Types } from 'mongoose'

export interface IVerifies
  extends Document {
  _id: Types.ObjectId;
  fee: string;
}

const VerifiesSchema = new Schema({
  fee: { type: String, required: true, unique: true },

})
//var address = Schema({title: string, checked: boolean});
const Verifies = models.Verifies || model('Verifies', VerifiesSchema)

export default Verifies
