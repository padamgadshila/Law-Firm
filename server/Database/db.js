import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    const db = process.env.DB;
    await mongoose
      .connect("mongodb://192.168.0.230:27017/law", {
        maxPoolSize: 150, // Allow up to 50 connections in the pool
        minPoolSize: 10, // Maintain at least 10 connections
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server found
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      })
      .then(() => {
        console.log("Connected to the database");
      });
  } catch (error) {
    console.log(error);
  }
};
export default connect;
