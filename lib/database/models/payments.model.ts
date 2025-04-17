import { Document, Schema, model, models } from "mongoose";

export interface IPayment extends Document {
  orderTrackingId: string;
  name: string;
  transactionId: string;
  amount: number;
  status: string;
  balance: string;
  date: Date; // Can be changed to Date type if needed
}

const PaymentSchema = new Schema(
  {
    orderTrackingId: { type: String, required: true },
    name: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'successful' },
    balance: { type: String },
    date: { type: Date }, // Use Date type if preferred
  },
  {
    timestamps: true,
  })
const Payment = models.Payment || model('Payment', PaymentSchema);

export default Payment;