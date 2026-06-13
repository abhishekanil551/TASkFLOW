import { IWorkspaceTaskRepository } from "../../../domain/repositories/IWorkspaceTaskRepository";
import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";

export class DeleteWorkspaceTask {
  constructor(
    private taskRepo: IWorkspaceTaskRepository,
    private workspaceRepo: IWorkspaceRepository
  ) {}

  async execute(
    taskId: string,
    adminId: string
  ) {
    if (!taskId) {
      throw new Error(
        "Task id is required"
      );
    }

    if (!adminId) {
      throw new Error(
        "Unauthorized"
      );
    }

    const task =
      await this.taskRepo.getTaskById(
        taskId
      );

    if (!task) {
      throw new Error(
        "Task not found"
      );
    }

    const members =
      await this.workspaceRepo.getWorkspaceMembers(
        task.workspaceId
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
        "Only admin can delete task"
      );
    }

    return this.taskRepo.deleteTask(
      taskId
    );
  }
}