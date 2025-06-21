import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://shireffn369:shireffnady@cluster0.qkehe.mongodb.net/helana?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error From database.js: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

export default connectDB;
