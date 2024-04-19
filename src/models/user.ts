import mongoose from "mongoose";
import Address from "./address";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    dob: { type: Date },
    profile_pic: { type: String },
    gender: { type: String },
    phone_number: { type: String },
    isTutor: { type: Boolean, required: true },
    address: { type: Address.schema },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
