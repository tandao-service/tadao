import * as z from "zod"
// Regular expression to match YouTube URLs
const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export const AdFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  imageUrls: z.array(z.string()).min(3, 'At least 3 images are required'), // Define imageUrls as an array of strings with minimum length 2
  youtube: z.string().refine(value => value === "" || youtubeRegex.test(value), {
    message: "Invalid YouTube URL or video ID"
  }).optional(),
  phone: z.string(),
  subcategory: z.string(),
  views: z.string(),
  categoryId: z.string(),
  price: z.union([z.string(), z.number()])
  .refine(value => !isNaN(Number(typeof value === 'string' ? value.replace(/,/g, "") : value)), {
    message: 'Price must be a valid number',
  })
  .transform(value => Number(typeof value === 'string' ? value.replace(/,/g, "") : value)),

  negotiable: z.boolean(),
  latitude: z.string(),
  longitude: z.string(),
  address: z.string(),
  enableMap: z.boolean(),
  make: z.string().optional(),
  vehiclemodel: z.string().optional(),
  vehicleyear: z.string().optional(),
  vehiclecolor: z.string().optional(),//Black,Blue,Gray,Silver,White,Beige,Brown,Burgundy,Gold,Green,Ivory,Matt Black,Off white,Orange, Pearl, Pink,Purple ,Red,Teal,Yellow,Others
  vehicleinteriorColor: z.string().optional(),
  vehiclecondition: z.string().optional(),//Brand New, Foreign Used, Local Used
  vehiclesecordCondition: z.string().optional(),//After crash,Engine Issue,First Owner,First registration, Gear issue,Need body repair,Need body repainting, Need repair,Original parts,Unpainted,Wiring problem, No fault
  vehicleTransmissions: z.string().optional(),
  vehiclemileage: z.string().optional(),
  vehiclekeyfeatures: z.array(z.string()).optional(),
  vehiclechassis: z.string().optional(),//VIN Chassis Number
  vehicleregistered: z.string().optional(),//yes,no
  vehicleexchangeposible: z.string().optional(),//yes,no
  vehicleFuelTypes: z.string().optional(),//petrol,disel,Electricity
  vehicleBodyTypes: z.string().optional(),
  vehicleSeats: z.string().optional(),
  vehicleEngineSizesCC: z.string().optional(),
  Types: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  furnishing: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  toilets: z.string().optional(),
  parking: z.string().optional(),
  status: z.string().optional(),
  area: z.string().optional(),
  landuse: z.string().optional(),
  listedby: z.string().optional(),
  fee: z.string().optional(),
  propertysecurity: z.string().optional(),
  floors: z.string().optional(),
  estatename: z.string().optional(),
  houseclass: z.string().optional()

});


const SubcategorySchema = z.object({
  title: z.string(), // Assuming title is a string
});
export const CategoryFormSchema = z.object({
  name: z.string().min(3, 'Category Name must be at least 3 characters'),
  subcategory: z.array(SubcategorySchema),
  imageUrl: z.string(), // Making the youtube field optional,
  
})
const BusinesshoursSchema = z.object({
  openHour:  z.string(),
  openMinute:  z.string(),
  closeHour:  z.string(),
  closeMinute:  z.string()
});
const VerifiedSchema = z.object({
  accountverified:  z.boolean(),
  verifieddate:  z.date()
  
});
export const UserFormSchema = z.object({
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photo: z.string(), // Making the youtube field optional,
  businessname: z.string().optional(),
  aboutbusiness:  z.string().min(3, 'About business must be at least 3 characters').max(400, 'About business must be less than 400 characters').optional(),
  businessaddress: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  businesshours: z.array(BusinesshoursSchema).optional(),
  businessworkingdays: z.array(z.string()).optional(),
  phone: z.string().optional(),
 whatsapp:z.string().optional(),
  website: z.string().url().optional(),
  facebook: z.string().url().optional(),
  twitter: z.string().url().optional(),
  instagram: z.string().url().optional(),
  tiktok: z.string().url().optional(),
 // verified: z.array(VerifiedSchema).optional(),
 imageUrl: z.string().optional(),
})
// Define the Feature schema

// Define the Feature schema
const FeatureSchema = z.object({
  title: z.string(), // Assuming title is a string
  checked: z.boolean() // Assuming checked is a boolean
});
// Define the Feature schema
const PriceSchema = z.object({
  period: z.string(), // Assuming title is a string
  amount: z.number() // Assuming checked is a boolean
});
export const packageFormSchema = z.object({
  name: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  features: z.array(FeatureSchema),
  price: z.array(PriceSchema),
  imageUrl: z.string(),
  color: z.string(),
  priority: z.union([z.string(), z.number()])
  .refine(value => !isNaN(Number(value)), {
    message: 'Priority must be a valid number',
  })
  .transform(value => Number(value)),
  list: z.union([z.string(), z.number()])
  .refine(value => !isNaN(Number(value)), {
    message: 'List must be a valid number',
  })
  .transform(value => Number(value))
});
export const VerifiesFormSchema = z.object({
  fee: z.string(),
})