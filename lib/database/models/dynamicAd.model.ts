import mongoose, { Document, Schema, Types, model, models } from "mongoose";

export interface IdynamicAd extends Document {
  data: any;
  organizer: {
    verified: Verified[];
    whatsapp: any;
    photo: string | undefined; _id: string, firstName: string, lastName: string
    token: string;
  }
  plan: {

    _id: Types.ObjectId, name: string, color: string, imageUrl: string
  };
  subcategory: any;
  views: string;
  priority: number;
  expirely: Date;
  adstatus: string;
  inquiries: string;
  whatsapp: string;
  calls: string;
  shared: string;
  bookmarked: string;
  abused: string;
  bids: any;
  //biddingEnabled: boolean;
  //biddingEndsAt?: Date;
  //bidIncrement?: number;
}
export interface Verified {
  accountverified: boolean
  verifieddate: Date
}
const BidSchema = new Schema({
  amount: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  username: String,
  timestamp: { type: Date, default: Date.now },
  isWinner: { type: Boolean, default: false }, // seller marks winner
  isAbusive: { type: Boolean, default: false }  // admin flags abusive bids
});
const dynamicAdSchema = new Schema({
  data: Schema.Types.Mixed, // Dynamic data based on selected category
  views: { type: String },
  priority: { type: Number },
  expirely: { type: Date },
  adstatus: { type: String },
  inquiries: { type: String },
  whatsapp: { type: String },
  calls: { type: String },
  shared: { type: String },
  bookmarked: { type: String },
  abused: { type: String },
  subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: Schema.Types.ObjectId, ref: 'Packages' },
  biddingEnabled: { type: Boolean, default: false },
  biddingEndsAt: { type: Date },                // When bidding ends
  bidIncrement: { type: Number, default: 100 }, // Minimum bid increment
  bids: [BidSchema],
  createdAt: { type: Date, default: Date.now }
},
  { timestamps: false });
delete mongoose.models.DynamicAd;
const DynamicAd = models.DynamicAd || model('DynamicAd', dynamicAdSchema);

export default DynamicAd;