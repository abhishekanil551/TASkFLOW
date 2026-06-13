import { IWorkspaceTaskRepository } from "../../../domain/repositories/IWorkspaceTaskRepository";
import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class UpdateWorkspaceTask {
  constructor(
    private taskRepo: IWorkspaceTaskRepository,
    private workspaceRepo: IWorkspaceRepository,
    private notificationRepo: INotificationRepository
  ) { }

  async execute(
    taskId: string,
    userId: string,
    data: any
  ) {
    const task =
      await this.taskRepo.getTaskById(
        taskId
      );

    if (!task) {
      throw new Error(
        "Task not found"
      );
    }

    const members =
      await this.workspaceRepo.getWorkspaceMembers(
        task.workspaceId
      );

    const currentMember =
      members.find(
        (member) =>
          member.userId === userId
      );

    if (!currentMember) {
      throw new Error(
        "User not in workspace"
      );
    }

    const isAdmin =
      currentMember.role ===
      "admin";

    const isAssigned =
      task.assignedTo.includes(
        userId
      );

    if (
      !isAdmin &&
      !isAssigned
    ) {
      throw new Error(
        "Access denied"
      );
    }


    if (data.comment) {
      const updatedTask =
        await this.taskRepo.addComment(
          taskId,
          {
            userId,

            userName:
              currentMember.userId,

            message:
              data.comment,
          }
        );

      if (!updatedTask) {
        throw new Error(
          "Failed to add comment"
        );
      }

      await this.taskRepo.addActivity(
        taskId,
        {
          userId,

          action:
            "comment-added",

          description:
            "Added a comment",
        }
      );

      return updatedTask;
    }

    if (
      data.commentId &&
      data.reply
    ) {
      const updatedTask =
        await this.taskRepo.addReply(
          taskId,
          data.commentId,
          {
            userId,

            userName:
              currentMember.userId,

            message:
              data.reply,
          }
        );

      if (!updatedTask) {
        throw new Error(
          "Failed to add reply"
        );
      }

      await this.taskRepo.addActivity(
        taskId,
        {
          userId,

          action:
            "reply-added",

          description:
            "Added a reply",
        }
      );

      return updatedTask;
    }

    if (
      data.subTaskId !==
      undefined
    ) {
      const updatedTask =
        await this.taskRepo.updateSubTask(
          taskId,
          data.subTaskId,
          Boolean(
            data.completed
          )
        );

      if (!updatedTask) {
        throw new Error(
          "Failed to update subtask"
        );
      }

      await this.taskRepo.addActivity(
        taskId,
        {
          userId,

          action:
            "subtask-updated",

          description:
            data.completed
              ? "Subtask completed"
              : "Subtask reopened",
        }
      );

      return updatedTask;
    }


    const updateData: any = {};

    if (isAdmin) {
      updateData.title =
        data.title ??
        task.title;

      updateData.description =
        data.description ??
        task.description;

      updateData.priority =
        data.priority ??
        task.priority;

      updateData.dueDate =
        data.dueDate ??
        task.dueDate;

      updateData.assignedTo =
        data.assignedTo ??
        task.assignedTo;

      updateData.attachments =
        data.attachments ??
        task.attachments;

      updateData.subTasks =
        data.subTasks ??
        task.subTasks;

      updateData.status =
        data.status ??
        task.status;
    }

    if (!isAdmin) {
      if (
        data.status &&
        ![
          "in-progress",
          "submitted",
        ].includes(
          data.status
        )
      ) {
        throw new Error(
          "Members cannot set this status"
        );
      }

      if (data.status) {
        updateData.status =
          data.status;
      }

      if (
        data.status ===
        "in-progress"
      ) {
        await this.taskRepo.addActivity(
          taskId,
          {
            userId,
            action: "task-started",
            description:
              "Task started",
          }
        );
      }

      if (
        data.status ===
        "submitted"
      ) {
        if (
          task.status ===
          "submitted"
        ) {
          throw new Error(
            "Task already submitted"
          );
        }

        const incompleteSubTasks =
          task.subTasks.filter(
            (
              subTask
            ) =>
              !subTask.completed
          );

        if (
          incompleteSubTasks.length >
          0
        ) {
          throw new Error(
            "Complete all subtasks before submitting"
          );
        }

        if (
          !data.submissionAttachments ||
          data
            .submissionAttachments
            .length === 0
        ) {
          throw new Error(
            "Submission attachments are required"
          );
        }

        updateData.submittedAt =
          new Date().toISOString();

        updateData.submissionAttachments =
          data.submissionAttachments;

        updateData.submissionProofs =
          data.submissionProofs ||
          [];

        updateData.timeline = [
          ...(task.timeline || []),

          ...(data.submissionProofs || []).map(
            (proof: any) => ({
              type: "submission",

              userId,

              message:
                proof.description ||
                "Work submitted",

              link:
                proof.link,

              createdAt:
                new Date().toISOString(),
            })
          ),
        ];

        await this.taskRepo.addActivity(
          taskId,
          {
            userId,
            action: "task-submitted",
            description:
              "Task submitted for review",
          }
        );

        const admins =
          members.filter(
            (
              member
            ) =>
              member.role ===
              "admin"
          );

        for (const admin of admins) {
          await this.notificationRepo.create(
            {
              userId:
                admin.userId,

              workspaceId:
                task.workspaceId,

              taskId:
                task.id,

              title:
                "Task Submitted",

              message:
                `${task.title} was submitted for review`,

              type:
                "task-updated",

              read: false,

              createdAt:
                new Date().toISOString(),

              expiresAt:
                new Date(
                  Date.now() +
                  48 *
                  60 *
                  60 *
                  1000
                ),
            }
          );
        }
      }
    }

    if (isAdmin) {
      if (
        data.status ===
        "reviewing"
      ) {
        if (
          task.status !==
          "submitted"
        ) {
          throw new Error(
            "Task must be submitted first"
          );
        }

        updateData.reviewedAt =
          new Date().toISOString();

        await this.taskRepo.addActivity(
          taskId,
          {
            userId,
            action:
              "task-reviewing",
            description:
              "Task moved to review",
          }
        );
      }

      if (
        data.status ===
        "completed"
      ) {
        if (
          task.status !==
          "reviewing"
        ) {
          throw new Error(
            "Task must be under review first"
          );
        }

        updateData.reviewedAt =
          new Date().toISOString();

        updateData.timeline = [
          ...(task.timeline || []),

          {
            type: "approval",

            userId,

            message:
              "Task approved",

            createdAt:
              new Date().toISOString(),
          },
        ];

        updateData.reviewComment =
          "";

        await this.taskRepo.addActivity(
          taskId,
          {
            userId,
            action:
              "task-approved",
            description:
              "Task approved",
          }
        );

        for (const assignedUser of task.assignedTo) {
          await this.notificationRepo.create(
            {
              userId:
                assignedUser,

              workspaceId:
                task.workspaceId,

              taskId:
                task.id,

              title:
                "Task Approved",

              message:
                `${task.title} has been approved`,

              type:
                "task-approved",

              read: false,

              createdAt:
                new Date().toISOString(),

              expiresAt:
                new Date(
                  Date.now() +
                  48 *
                  60 *
                  60 *
                  1000
                ),
            }
          );
        }
      }

      if (
        task.status === "reviewing" &&
        data.status === "todo"
      ) {
        if (
          !data.reviewComment ||
          !data.reviewComment.trim()
        ) {
          throw new Error(
            "Rejection reason is required"
          );
        }

        updateData.reviewComment =
          data.reviewComment.trim();

        updateData.reviewedAt =
          new Date().toISOString();

        updateData.rejectedAt =
          new Date().toISOString();

        updateData.submittedAt =
          "";

        updateData.submissionAttachments =
          [];

        updateData.submissionProofs =
          [];

        updateData.timeline = [
          ...(task.timeline || []),

          {
            type: "rejection",

            userId,

            message:
              data.reviewComment.trim(),

            createdAt:
              new Date().toISOString(),
          },
        ];

        updateData.warningSent =
          false;

        updateData.overdueNotificationSent =
          false;


        await this.taskRepo.addActivity(
          taskId,
          {
            userId,
            action: "task-rejected",
            description:
              data.reviewComment.trim(),
          }
        );

        for (const assignedUser of task.assignedTo) {
          await this.notificationRepo.create({
            userId: assignedUser,
            workspaceId:
              task.workspaceId,
            taskId: task.id,
            title:
              "Task Rejected",
            message:
              data.reviewComment.trim(),
            type:
              "task-rejected",
            read: false,
            createdAt:
              new Date().toISOString(),
            expiresAt:
              new Date(
                Date.now() +
                48 *
                60 *
                60 *
                1000
              ),
          });
        }
      }
    }

    const updatedTask =
      await this.taskRepo.updateTask(
        taskId,
        updateData
      );

    if (!updatedTask) {
      throw new Error(
        "Failed to update task"
      );
    }

    return updatedTask;
  }
}