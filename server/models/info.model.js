import mongoose from "mongoose";
import Counter from "./counter.model.js";

const infoSchema = new mongoose.Schema(
  {
    _id: { type: String }, // Custom auto-incrementing ID
    documentNo: { type: String },
    village: { type: String },
    gatNo: { type: String },
    docType: { type: String },
    document: {},
    year: { type: String },
    filename: { type: String },
    extraInfo: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to auto-increment _id
infoSchema.pre("save", async function (next) {
  if (!this.isNew) return next(); // Only generate _id for new documents

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "info" }, // Use "info" as the counter identifier
      { $inc: { count: 1 } }, // Increment the count
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );

    this._id = counter.count.toString(); // Assign the incremented count as _id
    next();
  } catch (error) {
    next(error);
  }
});

const Info = mongoose.model("Info", infoSchema);

export default Info;
