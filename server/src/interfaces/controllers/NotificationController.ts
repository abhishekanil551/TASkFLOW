import { Request, Response } from "express";

import { GetUserNotifications } from "../../application/usecases/notifications/GetUserNotifications";
import { MarkNotificationRead } from "../../application/usecases/notifications/MarkNotificationRead";

export class NotificationController {
  constructor(
    private getUserNotifications: GetUserNotifications,
    private markNotificationRead: MarkNotificationRead
  ) {}

  async getMyNotifications(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
        "string"
          ? (req as any).userId
          : "";

      const notifications =
        await this.getUserNotifications.execute(
          userId
        );

      return res.status(200).json(
        notifications
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to fetch notifications",
      });
    }
  }

  async markAsRead(
    req: Request,
    res: Response
  ) {
    try {
      const notificationId =
        typeof req.params.id ===
        "string"
          ? req.params.id
          : "";

      const result =
        await this.markNotificationRead.execute(
          notificationId
        );

      return res.status(200).json(
        result
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to update notification",
      });
    }
  }
}