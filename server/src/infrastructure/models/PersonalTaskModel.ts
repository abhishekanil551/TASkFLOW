import mongoose from "mongoose";

const PersonalTaskSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    type: {
      type: String,
      enum: ["one-time", "recurring"],
      default: "one-time",
    },

    days: {
      type: [String],
      default: [],
    },

    startDate: {
      type: String,
    },

    dueDate: {
      type: String,
    },
    timeSpent: { type: Number, default: 0 },
    isTimerRunning: { type: Boolean, default: false },
    lastStartedAt: {
      type: Date,
      default: null,
    },
    lastCompletedDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const PersonalTaskModel = mongoose.model(
  "PersonalTask",
  PersonalTaskSchema,
);
