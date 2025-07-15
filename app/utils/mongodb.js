import mongoose from "mongoose";

const connectionUrl = process.env.MONGO_URI;

if (!connectionUrl) {
  throw new Error("MONGO_URI environment variable is not defined.");
}

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(connectionUrl, {
      dbName: "submissions", // or "Users" if you're using that
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDatabase;
