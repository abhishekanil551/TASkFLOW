import { NotificationModel } from "../models/NotificationModel";

import { Notification } from "../../domain/entities/Notification";

import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

export class NotificationRepository
  implements INotificationRepository
{
  async create(
    notification: Omit<
      Notification,
      "id"
    >
  ): Promise<Notification> {
    const created =
      await NotificationModel.create(
        notification
      );

    return this.map(
      created
    );
  }

  async getByUser(
    userId: string
  ): Promise<
    Notification[]
  > {
    const notifications =
      await NotificationModel.find(
        {
          userId,
        }
      )
        .sort({
          createdAt: -1,
        })
        .lean();

    return notifications.map(
      (
        notification
      ) =>
        this.map(
          notification
        )
    );
  }

  async markAsRead(
    id: string
  ): Promise<void> {
    await NotificationModel.findByIdAndUpdate(
      id,
      {
        read: true,
      }
    );
  }

  async delete(
    id: string
  ): Promise<void> {
    await NotificationModel.findByIdAndDelete(
      id
    );
  }

  async deleteExpired(): Promise<void> {
    await NotificationModel.deleteMany(
      {
        expiresAt: {
          $lt: new Date(),
        },
      }
    );
  }

  private map(
    notification: any
  ): Notification {
    return {
      id:
        notification._id.toString(),

      userId:
        notification.userId,

      workspaceId:
        notification.workspaceId,

      taskId:
        notification.taskId,

      title:
        notification.title,

      message:
        notification.message,

      type:
        notification.type,

      read:
        notification.read,

      createdAt:
        notification.createdAt
          ? new Date(
              notification.createdAt
            ).toISOString()
          : new Date().toISOString(),

      expiresAt:
        notification.expiresAt
          ? new Date(
              notification.expiresAt
            )
          : undefined,
    };
  }
}