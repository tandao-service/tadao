import { Schema, Types, model, models } from "mongoose";
export interface ITrans extends Document {

  _id: Types.ObjectId;
  orderTrackingId: string;
  amount: number;
  status: string;
  planId: {
    _id: string, name: string, color: string, imageUrl: string
  };
}
const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  orderTrackingId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: "Packages",
  },
  merchantId: {
    type: String,
  },
  period: {
    type: String,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
  },
});

const Transaction = models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;