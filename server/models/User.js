import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
      minlength: 6,
    },
    googleId: {
      type: String,
      default: null,
      index: true,
    },
    role: {
      type: String,
      enum: ['client', 'freelancer'],
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
)

const User = mongoose.model('User', userSchema)

export default User
