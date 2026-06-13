import { IWorkspaceTaskRepository } from "../../../domain/repositories/IWorkspaceTaskRepository";
import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";
import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class CreateWorkspaceTask {
  constructor(
    private taskRepo: IWorkspaceTaskRepository,
    private workspaceRepo: IWorkspaceRepository,
    private notificationRepo: INotificationRepository
  ) {}

  async execute(
    adminId: string,
    data: any
  ) {
    if (!adminId) {
      throw new Error(
        "Unauthorized"
      );
    }

    if (!data.workspaceId) {
      throw new Error(
        "Workspace id is required"
      );
    }

    if (
      !data.title ||
      !data.title.trim()
    ) {
      throw new Error(
        "Task title is required"
      );
    }

    const members =
      await this.workspaceRepo.getWorkspaceMembers(
        data.workspaceId
      );

    const admin =
      members.find(
        (member) =>
          member.userId ===
            adminId &&
          member.role ===
            "admin"
      );

    if (!admin) {
      throw new Error(
        "Only admin can create tasks"
      );
    }

    const task =
      await this.taskRepo.createTask({
        ...data,

        title:
          data.title.trim(),

        description:
          data.description ||
          "",

        assignedTo:
          Array.isArray(
            data.assignedTo
          )
            ? data.assignedTo
            : [],

        attachments:
          Array.isArray(
            data.attachments
          )
            ? data.attachments
            : [],

        subTasks:
          Array.isArray(
            data.subTasks
          )
            ? data.subTasks
            : [],

        submissionAttachments:
          [],

        submissionProofs:
          [],

        comments:
          [],

        activities: [
          {
            id: "",

            userId:
              adminId,

            action:
              "task-created",

            description:
              "Task created",

            createdAt:
              new Date().toISOString(),
          },
        ],

        submittedAt:
          "",

        reviewedAt:
          "",

        rejectedAt:
          "",

        reviewComment:
          "",

        warningSent:
          false,

        overdueNotificationSent:
          false,

        createdBy:
          adminId,
      });

    for (const userId of task.assignedTo) {
      try {
        await this.notificationRepo.create({
          userId,

          workspaceId:
            task.workspaceId,

          taskId:
            task.id,

          title:
            "New Task Assigned",

          message:
            `You were assigned to "${task.title}"`,

          type:
            "task-assigned",

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
      } catch (
        error
      ) {
        console.error(
          "NOTIFICATION ERROR:",
          error
        );
      }
    }

    return task;
  }
}