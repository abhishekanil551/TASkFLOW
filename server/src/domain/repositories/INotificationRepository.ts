import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  create(
    notification: Omit<
      Notification,
      "id"
    >
  ): Promise<Notification>;

  getByUser(
    userId: string
  ): Promise<
    Notification[]
  >;

  markAsRead(
    id: string
  ): Promise<void>;

  delete(
    id: string
  ): Promise<void>;

  deleteExpired(): Promise<void>;
}