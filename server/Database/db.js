import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    const db = process.env.DB;
    await mongoose.connect("mongodb://127.0.0.1:27017/law").then(() => {
      console.log("Connected to the database");
    });
  } catch (error) {
    console.log(error);
  }
};
export default connect;
