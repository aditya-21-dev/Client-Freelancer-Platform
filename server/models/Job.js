import mongoose from 'mongoose'

const submissionMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['client', 'freelancer'],
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
    versionKey: false,
  },
)

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    submission: {
      file: {
        type: String,
        default: '',
      },
      submittedAt: {
        type: Date,
        default: null,
      },
      status: {
        type: String,
        enum: ['pending', 'submitted', 'revision', 'completed'],
        default: 'pending',
      },
    },
    submissionMessages: {
      type: [submissionMessageSchema],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
)

const Job = mongoose.model('Job', jobSchema)

export default Job
