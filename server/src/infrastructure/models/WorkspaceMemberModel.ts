import mongoose from "mongoose";

const workspaceMemberSchema = new mongoose.Schema({
  workspaceId: { type: String, required: true },
  userId: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },

  joinedAt: { type: Date, default: Date.now },
});

export const WorkspaceMemberModel = mongoose.model(
  "WorkspaceMember",
  workspaceMemberSchema
);