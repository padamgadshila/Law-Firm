import mongoose from "mongoose";

export let getId = (id) => {
  const cleanedCid = id.replace(/['"]+/g, "");
  const objectId = new mongoose.Types.ObjectId(cleanedCid);
  return objectId;
};
