import { WorkspaceModel } from "../models/WorkspaceModel";
import { WorkspaceMemberModel } from "../models/WorkspaceMemberModel";
import { IWorkspaceRepository } from "../../domain/repositories/IworkspaceRepository";
import { UserModel } from "../models/UserModel";

export class WorkspaceRepository implements IWorkspaceRepository {
  async createWorkspace(data: {
    name: string;
    ownerId: string;
  }) {
    const workspace =
      await WorkspaceModel.create(
        data
      );

    await WorkspaceMemberModel.create(
      {
        workspaceId:
          workspace._id.toString(),
        userId:
          data.ownerId,
        role: "admin",
      }
    );

    return {
      id:
        workspace._id.toString(),
      name:
        workspace.name,
      ownerId:
        workspace.ownerId,
      createdAt:
        workspace.createdAt.toISOString(),
      updatedAt:
        workspace.updatedAt.toISOString(),
    };
  }

  

  async deleteWorkspace(
    workspaceId: string
  ) {
    await WorkspaceModel.findByIdAndDelete(
      workspaceId
    );

    await WorkspaceMemberModel.deleteMany(
      {
        workspaceId,
      }
    );

    return true;
  }

  async getUserWorkspaces(
    userId: string
  ) {
    const memberships =
      await WorkspaceMemberModel.find(
        {
          userId,
        }
      );

    const workspaceIds =
      memberships.map(
        (member) =>
          member.workspaceId
      );

    const workspaces =
      await WorkspaceModel.find(
        {
          _id: {
            $in: workspaceIds,
          },
        }
      );

    return workspaces.map(
      (workspace) => ({
        id:
          workspace._id.toString(),
        name:
          workspace.name,
        ownerId:
          workspace.ownerId,
        createdAt:
          workspace.createdAt.toISOString(),
        updatedAt:
          workspace.updatedAt.toISOString(),
      })
    );
  }

  async addMember(data: {
    workspaceId: string;
    userId: string;
    role?: "admin" | "member";
  }) {
    const exists =
      await WorkspaceMemberModel.findOne(
        {
          workspaceId:
            data.workspaceId,
          userId:
            data.userId,
        }
      );

    if (exists) {
      throw new Error(
        "User already in workspace"
      );
    }

    const member =
      await WorkspaceMemberModel.create(
        {
          workspaceId:
            data.workspaceId,
          userId:
            data.userId,
          role:
            data.role ||
            "member",
        }
      );

    const user =
      await UserModel.findById(
        member.userId
      );

    return {
      id:
        member._id.toString(),
      workspaceId:
        member.workspaceId,
      userId:
        member.userId,
      role:
        member.role,
      email:
        user?.email || "",
      name:
        user?.name || "",
      joinedAt:
        member.joinedAt.toISOString(),
    };
  }

  async getWorkspaceById(
    workspaceId: string
  ) {
    const workspace =
      await WorkspaceModel.findById(
        workspaceId
      );

    if (!workspace) {
      return null;
    }

    return {
      id:
        workspace._id.toString(),
      name:
        workspace.name,
      ownerId:
        workspace.ownerId,
      createdAt:
        workspace.createdAt.toISOString(),
      updatedAt:
        workspace.updatedAt.toISOString(),
    };
  }

  async updateWorkspace(
    workspaceId: string,
    name: string
  ) {
    const workspace =
      await WorkspaceModel.findByIdAndUpdate(
        workspaceId,
        {
          name,
        },
        {
          new: true,
        }
      );

    if (!workspace) {
      return null;
    }

    return {
      id:
        workspace._id.toString(),
      name:
        workspace.name,
      ownerId:
        workspace.ownerId,
      createdAt:
        workspace.createdAt.toISOString(),
      updatedAt:
        workspace.updatedAt.toISOString(),
    };
  }

  async getWorkspaceMembers(
    workspaceId: string
  ) {
    const members =
      await WorkspaceMemberModel.find(
        {
          workspaceId,
        }
      );

    const enrichedMembers =
      await Promise.all(
        members.map(
          async (
            member
          ) => {
            const user =
              await UserModel.findById(
                member.userId
              );

            return {
              id:
                member._id.toString(),
              workspaceId:
                member.workspaceId,
              userId:
                member.userId,
              role:
                member.role,
              email:
                user?.email ||
                "",
              name:
                user?.name ||
                "",
              joinedAt:
                member.joinedAt.toISOString(),
            };
          }
        )
      );

    return enrichedMembers;
  }

  async removeMember(
    workspaceId: string,
    userId: string
  ) {
    const member =
      await WorkspaceMemberModel.findOne({
        workspaceId,
        userId,
      });

    if (!member) {
      return false;
    }

    if (member.role === "admin") {
      const adminCount =
        await WorkspaceMemberModel.countDocuments({
          workspaceId,
          role: "admin",
        });

      if (adminCount === 1) {
        throw new Error(
          "Cannot remove last admin"
        );
      }
    }

    const deleted =
      await WorkspaceMemberModel.findOneAndDelete(
        {
          workspaceId,
          userId,
        }
      );

    return !!deleted;
  }

  async updateMemberRole(
    workspaceId: string,
    userId: string,
    role: "admin" | "member"
  ) {
    const current =
      await WorkspaceMemberModel.findOne({
        workspaceId,
        userId,
      });

    if (!current) {
      return null;
    }

    if (
      current.role === "admin" &&
      role === "member"
    ) {
      const adminCount =
        await WorkspaceMemberModel.countDocuments({
          workspaceId,
          role: "admin",
        });

      if (adminCount === 1) {
        throw new Error(
          "Cannot demote last admin"
        );
      }
    }

    const updated =
      await WorkspaceMemberModel.findOneAndUpdate(
        {
          workspaceId,
          userId,
        },
        {
          role,
        },
        {
          new: true,
        }
      );

    if (!updated) {
      return null;
    }

    const user =
      await UserModel.findById(
        updated.userId
      );

    return {
      id:
        updated._id.toString(),
      workspaceId:
        updated.workspaceId,
      userId:
        updated.userId,
      role:
        updated.role,
      email:
        user?.email || "",
      name:
        user?.name || "",
      joinedAt:
        updated.joinedAt.toISOString(),
    };
  }
}