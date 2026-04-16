import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    client_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true
    },
    skills: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one skill is required"
      }
    },
    budget_type: {
      type: String,
      enum: ["fixed", "hourly"],
      required: true
    },
    budget_min: {
      type: Number,
      required: true
    },
    budget_max: {
      type: Number,
      required: true
    },
    duration: {
      type: String,
      default: ""
    },
    experience_level: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      default: "beginner"
    },
    category: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["open", "in_progress", "completed"],
      default: "open"
    },
    attachments: {
      type: [String],
      default: []
    },
    proposalsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

export default mongoose.model("Project", projectSchema);

