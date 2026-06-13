import { INotificationRepository } from "../../../domain/repositories/INotificationRepository";

export class MarkNotificationRead {
  constructor(
    private notificationRepo: INotificationRepository
  ) {}

  async execute(
    notificationId: string
  ) {
    if (!notificationId) {
      throw new Error(
        "Notification id is required"
      );
    }

    await this.notificationRepo.markAsRead(
      notificationId
    );

    return {
      success: true,
    };
  }
}