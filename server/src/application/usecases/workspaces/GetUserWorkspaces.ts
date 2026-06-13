import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";

export class GetUserWorkspaces {
  constructor(
    private repo: IWorkspaceRepository
  ) {}

  async execute(
    userId: string
  ) {
    const workspaces =
      await this.repo.getUserWorkspaces(
        userId
      );

    return {
      hasWorkspace:
        workspaces.length > 0,

      totalWorkspaces:
        workspaces.length,

      workspaces,
    };
  }
}