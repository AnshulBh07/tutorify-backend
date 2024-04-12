import mongoose from "mongoose";
const Schema = mongoose.Schema;

const LessonSchema = new Schema(
  {
    language: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String },
    level: { type: String, required: true },
    duration: { type: Number, required: true },
    availability: { type: [String], required: true },
    time_slots: { type: [String], required: true },
    rating: { type: Number },

    // reference to the tutor with their user id
    teacher: { type: Schema.Types.ObjectId, ref: "Tutor", required: true },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", LessonSchema);
export default Lesson;
