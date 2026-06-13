import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
  },
  { timestamps: true }
);

export const WorkspaceModel = mongoose.model("Workspace", workspaceSchema);