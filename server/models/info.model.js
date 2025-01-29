import mongoose from "mongoose";

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

const Info = mongoose.model("Info", infoSchema);

export default Info;
