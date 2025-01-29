import mongoose from "mongoose";
import Counter from "./counter.model.js";
const clientSchema = new mongoose.Schema(
  {
    clientId: { type: String },
    fname: { type: String },
    mname: { type: String },
    lname: { type: String },
    email: { type: String },
    mobile: { type: String },
    caseType: { type: String },
    address: {
      state: { type: String },
      city: { type: String },
      village: { type: String },
      pincode: { type: String },
    },
    status: { type: String },
    fileUploaded: { type: String },
    hide: { type: Boolean },
  },
  { timestamps: true }
);
clientSchema.pre("save", async function (next) {
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
const Client = mongoose.model("Client", clientSchema);

export default Client;
