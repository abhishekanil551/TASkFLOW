import { IWorkspaceRepository } from "../../../domain/repositories/IworkspaceRepository";

export class ManageWorkspace {
  constructor(
    private repo: IWorkspaceRepository
  ) { }

  private async ensureAdmin(
    workspaceId: string,
    userId: string
  ) {
    const members =
      await this.repo.getWorkspaceMembers(
        workspaceId
      );

    const currentUser =
      members.find(
        (member) =>
          member.userId ===
          userId
      );

    if (
      !currentUser ||
      currentUser.role !==
      "admin"
    ) {
      throw new Error(
        "Only admin allowed"
      );
    }

    return currentUser;
  }

  // REMOVE MEMBER
  async removeMember(
    workspaceId: string,
    adminId: string,
    memberId: string
  ) {
    await this.ensureAdmin(
      workspaceId,
      adminId
    );

    if (adminId === memberId) {
      throw new Error(
        "Admin cannot remove self"
      );
    }

    return this.repo.removeMember(
      workspaceId,
      memberId
    );
  }

  // UPDATE MEMBER ROLE
  async updateMemberRole(
    workspaceId: string,
    adminId: string,
    memberId: string,
    role: "admin" | "member"
  ) {
    await this.ensureAdmin(
      workspaceId,
      adminId
    );

    if (
      role !== "admin" &&
      role !== "member"
    ) {
      throw new Error(
        "Invalid role"
      );
    }

    return this.repo.updateMemberRole(
      workspaceId,
      memberId,
      role
    );
  }


  async updateWorkspace(
    workspaceId: string,
    adminId: string,
    name: string
  ) {
    await this.ensureAdmin(
      workspaceId,
      adminId
    );

    if (!name?.trim()) {
      throw new Error(
        "Workspace name required"
      );
    }

    return this.repo.updateWorkspace(
      workspaceId,
      name.trim()
    );
  }


  async deleteWorkspace(
    workspaceId: string,
    adminId: string
  ) {
    await this.ensureAdmin(
      workspaceId,
      adminId
    );

    return this.repo.deleteWorkspace(
      workspaceId
    );
  }
}