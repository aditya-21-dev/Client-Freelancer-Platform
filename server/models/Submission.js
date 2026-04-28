import mongoose from 'mongoose'

const submissionSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['submitted', 'revision', 'approved'],
      default: 'submitted',
      index: true,
    },
    revisionMessage: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

submissionSchema.index({ jobId: 1, freelancerId: 1, createdAt: -1 })

const Submission = mongoose.model('Submission', submissionSchema)

export default Submission
