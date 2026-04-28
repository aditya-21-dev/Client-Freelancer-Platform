import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Earnings = mongoose.model("Earnings", earningsSchema);

export default Earnings;
