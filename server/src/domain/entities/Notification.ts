export type NotificationType =
  | "task-assigned"
  | "task-updated"
  | "task-submitted"
  | "task-approved"
  | "task-rejected"
  | "task-overdue"
  | "task-due-soon"
  | "task-comment"
  | "task-comment-reply";

export type Notification = {
  id: string;

  userId: string;

  title: string;

  message: string;

  type: NotificationType;

  read: boolean;

  taskId?: string;

  workspaceId?: string;

  createdAt: string;

  expiresAt?: Date;
};