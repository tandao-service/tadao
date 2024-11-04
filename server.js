import { connectToDatabase } from './inex.js';
import cron from 'node-cron';
import { DateTime } from 'luxon';
import mongoose from 'mongoose'; // Ensure proper mongoose import

// Define your subscription schema
const subscriptionSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true },
  plan: { type: String, required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, required: true },
  period: { type: String, required: true }, // Example: '7 days'
  status: { type: String, default: 'Active' },
});

const Subscription = mongoose.model('Transaction', subscriptionSchema);
// Define your ad schema
const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  imageUrls: [String],
  negotiable: Boolean,
  latitude: String,
  longitude: String,
  address: String,
  phone: String,
  subcategory: String,
  price: Number,
  make: String,
  vehiclemodel: String,
  vehicleyear: String,
  vehiclecolor: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, required: true },
  priority: { type: Number, default: 1 },
  status: String,
  createdAt: { type: Date, default: Date.now },
});

const Ad = mongoose.model('Ad', adSchema);

function calculateExpiration(createdAt, period) {
  const [value, unit] = period.split(' '); // Split period into value and unit (e.g., 7 days)
  console.log(DateTime.fromJSDate(createdAt).plus({ [unit]: parseInt(value) }).toJSDate());
  return DateTime.fromJSDate(createdAt).plus({ [unit]: parseInt(value) }).toJSDate(); // Using Luxon for date calculations
}

// Function to check expired subscriptions
async function checkExpiredSubscriptions() {
  const now = new Date();

  try {
    await connectToDatabase(); // Connect to the database

    const subscriptions = await Subscription.find({ 
      status: 'Active', 
      plan: { $ne: 'Verification' } // $ne operator checks for "not equal"
    });
    console.log(subscriptions);
    subscriptions.forEach(async (subscription) => {
      const expirationDate = calculateExpiration(subscription.createdAt, subscription.period);

      if (expirationDate <= now) {
        // Mark the subscription as expired
        subscription.status = 'Expired';
        await subscription.save();
        console.log(`Subscription expired: Buyer: ${subscription.buyer}, Plan ID: ${subscription.planId}`);
        // Update ads where the buyer matches the organizer
        await Ad.updateMany(
          { organizer: subscription.buyer }, // Match ads with the organizer
          { 
            priority: 1, // Set priority to 1
            plan: '65fa7d3fb20de072ea107223' // Set the plan ID
          }
        );
        console.log(`Updated ads for buyer: ${subscription.buyer}`);
      }
    });
     // Update ads for Premium and Diamond packages
     const premiumPackageId = '65fa9284b20de072ea107415'; // replace with actual ObjectId if needed
     const diamondPackageId = '65fa9534b20de072ea10751f'; // replace with actual ObjectId for Diamond package
 
     // Find ads with Premium package
     const premiumAds = await Ad.find({
       plan: premiumPackageId,
       adstatus: 'Active',
     });
 
     // Update createdAt for Premium ads
     premiumAds.forEach(async (ad) => {
       const lastUpdatedTime = new Date(ad.createdAt).getTime();
       const currentTime = new Date().getTime();
 
       if (currentTime - lastUpdatedTime >= 24 * 60 * 60 * 1000) { // 24 hours
         ad.createdAt = new Date(); // Update to current time
         await ad.save();
         console.log(`Updated Premium ad: ${ad._id}`);
       }
     });
 
     // Find ads with Diamond package
     const diamondAds = await Ad.find({
       plan: diamondPackageId,
       adstatus: 'Active',
     });
 
     // Update createdAt for Diamond ads
     diamondAds.forEach(async (ad) => {
       const lastUpdatedTime = new Date(ad.createdAt).getTime();
       const currentTime = new Date().getTime();
 
       if (currentTime - lastUpdatedTime >= 12 * 60 * 60 * 1000) { // 12 hours
         ad.createdAt = new Date(); // Update to current time
         await ad.save();
         console.log(`Updated Diamond ad: ${ad._id}`);
       }
     });
  } catch (err) {
    console.error('Error checking subscriptions:', err);
  }
}

// Schedule the task to run once a day at midnight ''0 */12 * * *'
cron.schedule('0 */12 * * *', async () => {
  console.log('Running subscription expiration check...');
  await checkExpiredSubscriptions();
});

// Close the MongoDB connection when the script stops
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});
