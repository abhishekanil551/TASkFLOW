import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class CreateWorkspace {
  constructor(
    private workspaceRepo: IWorkspaceRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(data: {
    name: string;
    ownerId: string;
    members: { email: string }[];
  }) {
    if (
      !data.name ||
      data.name.trim() === ""
    ) {
      throw new Error(
        "Workspace name is required"
      );
    }

    const members =
      data.members || [];

    const workspace =
      await this.workspaceRepo.createWorkspace(
        {
          name: data.name,
          ownerId:
            data.ownerId,
        }
      );

    for (const member of members) {
      const user =
        await this.userRepo.findByEmail(
          member.email
        );

      if (!user) {
        continue;
      }

      if (
        user.id ===
        data.ownerId
      ) {
        continue;
      }

      try {
        await this.workspaceRepo.addMember(
          {
            workspaceId:
              workspace.id,
            userId:
              user.id,
            role:
              "member",
          }
        );
      } catch {
        continue;
      }
    }

    return workspace;
  }
}