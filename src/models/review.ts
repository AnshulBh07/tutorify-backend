import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // reference to user schema as only a user can review, i.e all reviewers are users
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

export default Review;
