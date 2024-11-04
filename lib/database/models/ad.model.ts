import { Document, Schema, model, models } from "mongoose";

export interface IAd extends Document {
  adId: any;
  _id: string;
  title: string;
  description?: string;
  createdAt: Date;
  imageUrls: string[];
  negotiable: boolean;
  enableMap: boolean;
  latitude: string;
  longitude: string;
  address: string;
  youtube?: string;
  phone: string;
  subcategory: string;
  views: string;
  price: number;
  make:string;
  vehiclemodel:string;
  vehicleyear:string;
  vehiclecolor:string;//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
  vehicleinteriorColor:string;
  vehiclecondition:string;//Brand New, Foreign Used, Local Used
  vehiclesecordCondition:string;//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
  vehicleTransmissions:string;
  vehiclemileage:string;
  vehiclekeyfeatures:string[];
  vehiclechassis:string;//VIN Chassis Number
  vehicleregistered:string;//yes,no
  vehicleexchangeposible:string;//yes,no
  vehicleFuelTypes:string;//petrol,disel,Electricity
  vehicleBodyTypes:string;
  vehicleSeats:string;
  vehicleEngineSizesCC:string;
  Types:string;
  bedrooms:string;
  bathrooms:string;
  furnishing:string;
  amenities:string[];
  toilets:string;
  parking:string;
  status:string;
  area:string;
  landuse:string;
  listedby:string;
  fee:string;
  propertysecurity:string;
  floors:string;
  estatename:string;
  houseclass:string;
  calcDistance?:number;
  category: { _id: string, name: string }
  organizer: {
    verified: Verified[];
    whatsapp: any;
    photo: string | undefined; _id: string, firstName: string, lastName: string 
}
  plan: {
    
    _id: string, name: string ,color: string,imageUrl: string
};
priority:number;
expirely:Date;
adstatus:string;
inquiries:string;
whatsapp:string;
calls:string;
shared:string;
bookmarked:string;
abused:string;
}
export interface Verified {
  accountverified: boolean 
  verifieddate: Date
}
const AdSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrls: { type: [String], required: true },
  negotiable: { type: Boolean, default: false },
  enableMap: { type: Boolean, default: false },
  latitude:{ type: String },
  longitude: { type: String },
  geometry:  { type: 
    { type: String, default: "Point" }, 
    coordinates: { 
       type: [Number], index: "2dsphere" //creates the index 
    } 
 }, 
  address: { type: String },
  youtube: { type: String },
  phone: { type: String },
  subcategory: { type: String },
  views:{ type: String },
  price: { type: Number },
  make:{ type: String },
  vehiclemodel:{ type: String },
  vehicleyear:{ type: String },
  vehiclecolor:{ type: String },//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
  vehicleinteriorColor:{ type: String },
  vehiclecondition:{ type: String },//Brand New, Foreign Used, Local Used
  vehiclesecordCondition:{ type: String },//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
  vehicleTransmissions:{ type: String },
  vehiclemileage:{ type: String },
  vehiclekeyfeatures:{ type: [String], required: true },
  vehiclechassis:{ type: String },//VIN Chassis Number
  vehicleregistered:{ type: String },//yes,no
  vehicleexchangeposible:{ type: String },//yes,no
  vehicleFuelTypes:{ type: String },//petrol,disel,Electricity
  vehicleBodyTypes:{ type: String },
  vehicleSeats:{ type: String },
  vehicleEngineSizesCC:{ type: String },
  Types:{ type: String },
  bedrooms:{ type: String },
  bathrooms:{ type: String },
  furnishing:{ type: String },
  amenities:{ type: [String], required: true },
  toilets:{ type: String },
  parking:{ type: String },
  status:{ type: String },
  area:{ type: String },
  landuse:{ type: String },
  propertysecurity:{ type: String },
  floors:{ type: String },
  estatename:{ type: String },
  houseclass:{ type: String },
  listedby:{ type: String },
  fee:{ type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  plan: { type: Schema.Types.ObjectId, ref: 'Packages' },
  priority:{ type: Number },
  expirely:{ type: Date },
  adstatus:{type: String},
  inquiries:{ type: String },
  whatsapp:{ type: String },
  calls:{ type: String },
  shared:{ type: String },
  bookmarked:{ type: String },
  abused:{ type: String }
})

const Ad = models.Ad || model('Ad', AdSchema);

export default Ad;