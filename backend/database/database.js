const mongoose = require("mongoose");

const mongoConnect = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL environment variable is missing! Please configure MONGO_URL in your Render dashboard under Environment.");
    }
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message || err);
    process.exit(1);
  }
};

module.exports = mongoConnect;