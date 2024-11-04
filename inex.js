import mongoose from 'mongoose';
//const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI; // Get MongoDB URI from environment variable
const MONGODB_URI ="mongodb+srv://paulirungu:0lbQiEu2hMhynWGa@clusterofferup.kfn7otb.mongodb.net/?retryWrites=true&w=majority";
let cached = global.mongoose || { conn: null, promise: null };
export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is missing');

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'Offerup',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};

global.mongoose = cached;
