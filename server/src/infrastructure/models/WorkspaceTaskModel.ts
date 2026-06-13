import mongoose from "mongoose";

const subTaskSchema =
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    attachments: {
      type: [String],
      default: [],
    },
  });

const commentSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      userName: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        required: true,
      },

      createdAt: {
        type: String,
        required: true,
      },

      replies: [
        {
          userId: {
            type: String,
            required: true,
          },

          userName: {
            type: String,
            default: "",
          },

          message: {
            type: String,
            required: true,
          },

          createdAt: {
            type: String,
            required: true,
          },
        },
      ],
    },
    {
      _id: true,
    }
  );

const activitySchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      action: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      createdAt: {
        type: String,
        required: true,
      },
    },
    {
      _id: true,
    }
  );


const timelineSchema =
  new mongoose.Schema(
    {
      type: {
        type: String,
        required: true,
      },

      userId: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        default: "",
      },

      link: {
        type: String,
        default: "",
      },

      createdAt: {
        type: String,
        required: true,
      },
    },
    {
      _id: true,
    }
  );


const workspaceTaskSchema =
  new mongoose.Schema(
    {
      workspaceId: {
        type: String,
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        default: "",
      },

      status: {
        type: String,

        enum: [
          "todo",
          "in-progress",
          "submitted",
          "reviewing",
          "completed",
        ],

        default: "todo",
      },

      priority: {
        type: String,

        enum: [
          "low",
          "medium",
          "high",
          "urgent",
        ],

        default: "medium",
      },

      assignedTo: {
        type: [String],
        default: [],
      },

      leaderId: {
        type: String,
        default: "",
      },

      createdBy: {
        type: String,
        required: true,
      },

      attachments: {
        type: [String],
        default: [],
      },

      submissionAttachments: {
        type: [String],
        default: [],
      },

      submissionProofs: {
        type: [
          {
            id: {
              type: String,
              default: "",
            },

            link: {
              type: String,
              default: "",
            },

            description: {
              type: String,
              default: "",
            },

            submittedBy: {
              type: String,
              default: "",
            },

            submittedAt: {
              type: String,
              default: "",
            },
          },
        ],
        default: [],
      },

      dueDate: {
        type: String,
        default: "",
      },

      submittedAt: {
        type: String,
        default: "",
      },

      reviewedAt: {
        type: String,
        default: "",
      },

      rejectedAt: {
        type: String,
        default: "",
      },

      reviewComment: {
        type: String,
        default: "",
      },

      warningSent: {
        type: Boolean,
        default: false,
      },

      overdueNotificationSent: {
        type: Boolean,
        default: false,
      },

      subTasks: {
        type: [subTaskSchema],
        default: [],
      },

      comments: {
        type: [commentSchema],
        default: [],
      },

      activities: {
        type: [activitySchema],
        default: [],
      },

      timeline: {
        type: [timelineSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );



export const WorkspaceTaskModel =
  mongoose.model(
    "WorkspaceTask",
    workspaceTaskSchema
  );