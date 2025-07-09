import mongoose from "mongoose";

const fundSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  fundId: {
    type: String,
    required: true,
  },
  fundName: {
    type: String,
    required: true,
  },
});

const Fund = mongoose.model("Fund", fundSchema);
export default Fund;
