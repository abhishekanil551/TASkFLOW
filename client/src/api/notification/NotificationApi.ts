import { api } from "../axios";

export type Notification = {
  id: string;

  title: string;

  message: string;

  read: boolean;

  createdAt: string;

  type:
    | "task-assigned"
    | "task-updated"
    | "task-overdue";

  taskId?: string;

  workspaceId?: string;
};

export const notificationApi = {
  getMyNotifications:
    async (): Promise<
      Notification[]
    > => {
      const res =
        await api.get(
          "/notifications"
        );

      return Array.isArray(
        res.data
      )
        ? res.data
        : [];
    },

  markAsRead:
    async (
      notificationId: string
    ) => {
      const res =
        await api.patch(
          `/notifications/${notificationId}/read`
        );

      return res.data;
    },
};