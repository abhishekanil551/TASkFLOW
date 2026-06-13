import { Notification } from "../../../domain/entities/Notification";

import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class GetUserNotifications {
  constructor(
    private notificationRepo: INotificationRepository
  ) {}

  async execute(
    userId: string
  ): Promise<Notification[]> {
    if (!userId) {
      throw new Error(
        "Unauthorized"
      );
    }

    return this.notificationRepo.getByUser(
      userId
    );
  }
}