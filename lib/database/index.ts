import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

export async function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  //console.log("=== MONGODB CONNECTION DEBUG ===");
  //console.log("Environment:", process.env.VERCEL_ENV || process.env.NODE_ENV);
  // console.log("MONGODB_URI exists:", !!MONGODB_URI);
  // console.log("Configured dbName: Tadaomarket");

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing");
    throw new Error("MONGODB_URI is missing");
  }

  if (cached.conn) {
    // console.log("Using cached MongoDB connection");
    // console.log("Database:", mongoose.connection.name);
    //console.log("Host:", mongoose.connection.host);
    // console.log("Ready state:", mongoose.connection.readyState);

    return cached.conn;
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URI, {
        dbName: "Tadaomarket",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;

    // console.log("MongoDB connected successfully");
    // console.log("Database:", mongoose.connection.name);
    // console.log("Host:", mongoose.connection.host);
    //console.log("Ready state:", mongoose.connection.readyState);

    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);

    cached.promise = null;
    cached.conn = null;

    throw error;
  }
}