import { Notification } from "../../../domain/entities/Notification";

import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class CreateNotification {
  constructor(
    private notificationRepo: INotificationRepository
  ) {}

  async execute(
    data: {
      userId: string;

      title: string;

      message: string;

      type:
        | "task-assigned"
        | "task-updated"
        | "task-overdue";

      workspaceId?: string;

      taskId?: string;
    }
  ): Promise<Notification> {
    return this.notificationRepo.create({
      userId:
        data.userId,

      title:
        data.title,

      message:
        data.message,

      type:
        data.type,

      workspaceId:
        data.workspaceId,

      taskId:
        data.taskId,

      read: false,

      createdAt:
        new Date().toISOString(),
    });
  }
}