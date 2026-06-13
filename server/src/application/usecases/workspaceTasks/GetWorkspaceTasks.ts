import { IWorkspaceTaskRepository } from "../../../domain/repositories/IWorkspaceTaskRepository";
import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";

export class GetWorkspaceTasks {
  constructor(
    private taskRepo: IWorkspaceTaskRepository,
    private workspaceRepo: IWorkspaceRepository
  ) { }

  async execute(
    workspaceId: string,
    userId: string,
    page: number = 1,
    limit: number = 50
  ) {
    if (!workspaceId) {
      throw new Error(
        "Workspace id is required"
      );
    }

    if (!userId) {
      throw new Error(
        "User id is required"
      );
    }

    const members =
      await this.workspaceRepo.getWorkspaceMembers(
        workspaceId
      );

    const currentMember =
      members.find(
        (member) =>
          member.userId ===
          userId
      );

    if (!currentMember) {
      throw new Error(
        "User not in workspace"
      );
    }

    const result =
      await this.taskRepo.getTasksByWorkspace(
        workspaceId,
        page,
        limit
      );

    const tasks =
      Array.isArray(result)
        ? result
        : result?.data || [];

    if (
      currentMember.role ===
      "admin"
    ) {
      return Array.isArray(result)
        ? tasks
        : {
          ...result,
          data: tasks,
        };
    }

console.log("LOGGED USER:", userId);

tasks.forEach((task) => {
  console.log(
    "TASK:",
    task.title,
    "ASSIGNED:",
    task.assignedTo
  );
});

const filteredTasks = tasks.filter((task) => {
  const assignedUsers =
    (task.assignedTo || []).map(
      (item: any) =>
        String(
          item?.userId ||
          item?.id ||
          item
        )
    );

  const match =
    assignedUsers.includes(
      String(userId)
    );

  console.log(
    "USER:",
    String(userId)
  );

  console.log(
    "ASSIGNED:",
    assignedUsers
  );

  console.log(
    "MATCH:",
    match
  );

  return match;
});

    return Array.isArray(result)
      ? filteredTasks
      : {
        ...result,
        data: filteredTasks,
      };
  }
}