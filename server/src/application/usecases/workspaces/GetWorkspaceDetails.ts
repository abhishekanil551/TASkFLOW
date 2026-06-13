import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";
import { IWorkspaceTaskRepository } from "../../../domain/repositories/IWorkspaceTaskRepository";

export class GetWorkspaceDetails {
  constructor(
    private workspaceRepo: IWorkspaceRepository,
    private taskRepo: IWorkspaceTaskRepository
  ) { }

  async execute(
    workspaceId: string,
    currentUserId: string
  ) {
    // WORKSPACE
    const workspace =
      await this.workspaceRepo.getWorkspaceById(
        workspaceId
      );

    if (!workspace) {
      throw new Error(
        "Workspace not found"
      );
    }

    // MEMBERS
    const members =
      await this.workspaceRepo.getWorkspaceMembers(
        workspaceId
      );

    const currentMember =
      members.find(
        (member) =>
          member.userId ===
          currentUserId
      );

    if (!currentMember) {
      throw new Error(
        "Access denied"
      );
    }

    const isAdmin =
      currentMember.role ===
      "admin";

    // TASKS
    const taskResult =
      await this.taskRepo.getTasksByWorkspace(
        workspaceId,
        1,
        1000
      );

    const visibleTasks =
      isAdmin
        ? taskResult.data
        : taskResult.data.filter(
          (task) =>
            task.assignedTo.includes(
              currentUserId
            )
        );

    return {
      ...workspace,

      currentUserId,

      currentUserRole:
        currentMember.role,

      permissions: {
        canManageWorkspace:
          isAdmin,

        canManageMembers:
          isAdmin,

        canCreateTasks:
          isAdmin,
      },

      members,

      tasks: visibleTasks,

      membersCount:
        members.length,

      totalTasks:
        visibleTasks.length,

      completedTasks:
        visibleTasks.filter(
          (task) =>
            task.status ===
            "completed"
        ).length,
    };
  }
}