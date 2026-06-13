import { WorkspaceTask } from "../entities/WorkspaceTask";

export interface IWorkspaceTaskRepository {
  createTask(
    data: Omit<
      WorkspaceTask,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "isOverdue"
    >
  ): Promise<WorkspaceTask>;

  getTaskById(
    taskId: string
  ): Promise<WorkspaceTask | null>;

  getTasksByWorkspace(
    workspaceId: string,
    page: number,
    limit: number
  ): Promise<{
    data: WorkspaceTask[];
    total: number;
    page: number;
    totalPages: number;
  }>;

  updateTask(
    id: string,
    data: Partial<WorkspaceTask>
  ): Promise<WorkspaceTask | null>;

  addComment(
    taskId: string,
    comment: {
      userId: string;
      userName: string;
      message: string;
    }
  ): Promise<WorkspaceTask | null>;

  addReply(
    taskId: string,
    commentId: string,
    reply: {
      userId: string;
      userName: string;
      message: string;
    }
  ): Promise<WorkspaceTask | null>;

  updateSubTask(
    taskId: string,
    subTaskId: string,
    completed: boolean
  ): Promise<WorkspaceTask | null>;

  addActivity(
    taskId: string,
    activity: {
      userId: string;
      action: string;
      description: string;
    }
  ): Promise<WorkspaceTask | null>;

  deleteTask(
    id: string
  ): Promise<boolean>;
}