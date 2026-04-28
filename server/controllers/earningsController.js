import mongoose from "mongoose";
import Earnings from "../models/Earnings.js";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const addEarnings = async (freelancerId, amount) => {
  const numericAmount = Number(amount);

  if (!freelancerId || !isValidObjectId(freelancerId)) {
    throw new Error("Invalid freelancer id");
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const earnings = await Earnings.findOneAndUpdate(
    { freelancerId },
    { $inc: { totalEarnings: numericAmount } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return earnings;
};

export const getMyEarnings = async (req, res) => {
  try {
    const freelancerId = req.user?._id

    if (!freelancerId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const earnings = await Earnings.findOne({ freelancerId }).select('totalEarnings freelancerId')

    return res.status(200).json({
      freelancerId,
      totalEarnings: Number(earnings?.totalEarnings || 0),
    })
  } catch (error) {
    console.error('[earnings.getMyEarnings] error', error)
    return res.status(500).json({ message: 'Failed to fetch earnings' })
  }
}
