import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class AddMember {
  constructor(
    private repo: IWorkspaceRepository,
    private userRepo: IUserRepository
  ) { }
  async execute(
    workspaceId: string,
    adminId: string,
    email: string,
    role: "admin" | "member" = "member"
  ) {
    const members =
      await this.repo.getWorkspaceMembers(
        workspaceId
      );

    const currentUser =
      members.find(
        (member) =>
          member.userId === adminId
      );

    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      throw new Error(
        "Only admin can add members"
      );
    }

    const user =
      await this.userRepo.findByEmail(
        email
      );

    if (!user) {
      throw new Error(
        "User not found"
      );
    }

    const alreadyExists =
      members.some(
        (member) =>
          member.userId === user.id
      );

    if (alreadyExists) {
      throw new Error(
        "User already exists in workspace"
      );
    }

    return this.repo.addMember({
      workspaceId,
      userId: user.id,
      role,
    });
  }
}