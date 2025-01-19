import mongoose from "mongoose";

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

const Client = mongoose.model("Client", clientSchema);

export default Client;
