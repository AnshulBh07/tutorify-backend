import mongoose from "mongoose";
import Review from "./review";
const Schema = mongoose.Schema;

const TutorSchema = new Schema({
  native_language: { type: String, required: true },
  tutor_type: { type: String, required: true },
  languages_taught: { type: [String], required: true },
  hourly_rate: { type: Number, required: true },
  number_of_students: { type: Number, required: true },
  intro: { type: String, required: true },
  demo_rate: { type: Number, required: true },
  number_of_lessons: { type: Number, required: true },
  status: { type: String, required: true },
  reviews: { type: [Review.schema], required: true },
  instant_rate: { type: Boolean, required: true },
  available: { type: Boolean, required: true },
  auto_accept: { type: Boolean, required: true },

  //   a reference to user to fetch other important details about a tutor
  // all tutors are users but not all users are tutors
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Tutor = mongoose.model("Tutor", TutorSchema);

export default Tutor;
