import { WorkspaceTaskModel } from "../models/WorkspaceTaskModel";

import { IWorkspaceTaskRepository } from "../../domain/repositories/IWorkspaceTaskRepository";

import { WorkspaceTask } from "../../domain/entities/WorkspaceTask";

export class WorkspaceTaskRepository
  implements IWorkspaceTaskRepository {
  async createTask(
    data: Omit<
      WorkspaceTask,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "isOverdue"
    >
  ) {
    const task =
      await WorkspaceTaskModel.create({
        ...data,

        attachments:
          data.attachments ||
          [],

        submissionAttachments:
          data.submissionAttachments ||
          [],

        submissionProofs:
          Array.isArray(
            data.submissionProofs
          )
            ? data.submissionProofs
            : [],

        comments:
          data.comments ||
          [],

        activities:
          data.activities ||
          [],

        timeline:
          data.timeline ||
          [],

        subTasks:
          data.subTasks ||
          [],
      });

    return this.map(
      task
    );
  }

  async getTasksByWorkspace(
    workspaceId: string,
    page: number,
    limit: number
  ) {
    const skip =
      (page - 1) *
      limit;

    const [
      tasks,
      total,
    ] =
      await Promise.all([
        WorkspaceTaskModel.find({
          workspaceId,
        })
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(limit),

        WorkspaceTaskModel.countDocuments({
          workspaceId,
        }),
      ]);

    return {
      data:
        tasks.map(
          (
            task
          ) =>
            this.map(
              task
            )
        ),

      total,

      page,

      totalPages:
        Math.ceil(
          total /
          limit
        ),
    };
  }

  async getTaskById(
    taskId: string
  ) {
    const task =
      await WorkspaceTaskModel.findById(
        taskId
      );

    if (!task) {
      return null;
    }

    return this.map(
      task
    );
  }

  async updateTask(
    id: string,
    data: Partial<WorkspaceTask>
  ) {
    const updated =
      await WorkspaceTaskModel.findByIdAndUpdate(
        id,
        {
          ...data,
        },
        {
          new: true,
        }
      );

    if (!updated) {
      return null;
    }

    return this.map(
      updated
    );
  }


  async addComment(
    taskId: string,
    comment: {
      userId: string;
      userName: string;
      message: string;
    }
  ) {
    const updated =
      await WorkspaceTaskModel.findByIdAndUpdate(
        taskId,
        {
          $push: {
            comments: {
              ...comment,
              createdAt:
                new Date().toISOString(),
              replies: [],
            },
          },
        },
        {
          new: true,
        }
      );

    return updated
      ? this.map(updated)
      : null;
  }

  async addReply(
    taskId: string,
    commentId: string,
    reply: {
      userId: string;
      userName: string;
      message: string;
    }
  ) {
    const updated =
      await WorkspaceTaskModel.findOneAndUpdate(
        {
          _id: taskId,
          "comments._id":
            commentId,
        },
        {
          $push: {
            "comments.$.replies":
            {
              ...reply,
              createdAt:
                new Date().toISOString(),
            },
          },
        },
        {
          new: true,
        }
      );

    return updated
      ? this.map(updated)
      : null;
  }

  async updateSubTask(
    taskId: string,
    subTaskId: string,
    completed: boolean
  ) {
    const updated =
      await WorkspaceTaskModel.findOneAndUpdate(
        {
          _id: taskId,
          "subTasks._id":
            subTaskId,
        },
        {
          $set: {
            "subTasks.$.completed":
              completed,
          },
        },
        {
          new: true,
        }
      );

    return updated
      ? this.map(updated)
      : null;
  }

  async addActivity(
    taskId: string,
    activity: {
      userId: string;
      action: string;
      description: string;
    }
  ) {
    const updated =
      await WorkspaceTaskModel.findByIdAndUpdate(
        taskId,
        {
          $push: {
            activities: {
              ...activity,
              createdAt:
                new Date().toISOString(),
            },
          },
        },
        {
          new: true,
        }
      );

    return updated
      ? this.map(updated)
      : null;
  }


  async deleteTask(
    id: string
  ) {
    await WorkspaceTaskModel.findByIdAndDelete(
      id
    );

    return true;
  }

  private map(
    task: any
  ): WorkspaceTask {
    return {
      id:
        task._id.toString(),

      workspaceId:
        task.workspaceId,

      title:
        task.title,

      description:
        task.description ||
        "",

      status:
        task.status,

      priority:
        task.priority,

      assignedTo:
        task.assignedTo ||
        [],

      leaderId:
        task.leaderId,

      createdBy:
        task.createdBy,

      dueDate:
        task.dueDate ||
        "",

      attachments:
        task.attachments ||
        [],

      submissionAttachments:
        task.submissionAttachments ||
        [],

      submissionProofs:
        task.submissionProofs?.map(
          (proof: any) => ({
            id:
              proof.id ||
              proof._id?.toString?.() ||
              "",

            link:
              proof.link ||
              "",

            description:
              proof.description ||
              "",

            submittedBy:
              proof.submittedBy ||
              "",

            submittedAt:
              proof.submittedAt ||
              "",
          })
        ) || [],

      submittedAt:
        task.submittedAt ||
        "",

      reviewedAt:
        task.reviewedAt ||
        "",

      rejectedAt:
        task.rejectedAt ||
        "",

      reviewComment:
        task.reviewComment ||
        "",

      warningSent:
        Boolean(
          task.warningSent
        ),

      overdueNotificationSent:
        Boolean(
          task.overdueNotificationSent
        ),

      comments:
        task.comments?.map(
          (
            comment: any
          ) => ({
            id:
              comment._id?.toString?.() ||
              "",

            userId:
              comment.userId ||
              "",

            userName:
              comment.userName ||
              "",

            message:
              comment.message ||
              "",

            createdAt:
              comment.createdAt ||
              "",

            replies:
              comment.replies?.map(
                (
                  reply: any
                ) => ({
                  id:
                    reply._id?.toString?.() ||
                    "",

                  userId:
                    reply.userId ||
                    "",

                  userName:
                    reply.userName ||
                    "",

                  message:
                    reply.message ||
                    "",

                  createdAt:
                    reply.createdAt ||
                    "",
                })
              ) || [],
          })
        ) || [],

      activities:
        task.activities?.map(
          (
            activity: any
          ) => ({
            id:
              activity._id?.toString?.() ||
              "",

            userId:
              activity.userId ||
              "",

            action:
              activity.action ||
              "",

            description:
              activity.description ||
              "",

            createdAt:
              activity.createdAt ||
              "",
          })
        ) || [],


      timeline:
        task.timeline?.map(
          (
            item: any
          ) => ({
            id:
              item._id?.toString?.() ||
              "",

            type:
              item.type ||
              "",

            userId:
              item.userId ||
              "",

            message:
              item.message ||
              "",

            link:
              item.link ||
              "",

            createdAt:
              item.createdAt ||
              "",
          })
        ) || [],


      subTasks:
        task.subTasks?.map(
          (
            subTask: any
          ) => ({
            id:
              subTask._id?.toString?.() ||
              "",

            title:
              subTask.title ||
              "",

            completed:
              Boolean(
                subTask.completed
              ),

            attachments:
              subTask.attachments ||
              [],
          })
        ) || [],

      createdAt:
        task.createdAt
          ?.toISOString?.() ||
        "",

      updatedAt:
        task.updatedAt
          ?.toISOString?.() ||
        "",

      isOverdue:
        Boolean(
          task.dueDate
        ) &&
        !isNaN(
          new Date(
            task.dueDate
          ).getTime()
        ) &&
        new Date(
          task.dueDate
        ) < new Date() &&
        task.status !==
        "completed",
    };
  }
}