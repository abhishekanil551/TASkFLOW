import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      workspaceId: {
        type: String,
      },

      taskId: {
        type: String,
      },

      title: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "task-assigned",
          "task-updated",
          "task-submitted",
          "task-approved",
          "task-rejected",
          "task-overdue",
          "task-due-soon",
          "task-comment",
          "task-comment-reply",
        ],
        required: true,
      },

      read: {
        type: Boolean,
        default: false,
      },

      expiresAt: {
        type: Date,
        required: true,

        default: () =>
          new Date(
            Date.now() +
              48 *
                60 *
                60 *
                1000
          ),

        index: {
          expires: 0,
        },
      },
    },
    {
      timestamps: true,
    }
  );

export const NotificationModel =
  mongoose.model(
    "Notification",
    notificationSchema
  );