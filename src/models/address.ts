import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AddressSchema = new Schema(
  {
    address_line1: { type: String, required: true },
    address_line2: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
