import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['normal', 'revision'],
      default: 'normal',
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

const Message = mongoose.model('Message', messageSchema)

export default Message
