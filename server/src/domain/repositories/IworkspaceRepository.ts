import { Workspace } from "../entities/Workspace";
import { WorkspaceMember } from "../entities/WorkspaceMember";

export interface IWorkspaceRepository {
  // WORKSPACE
  createWorkspace(data: {
    name: string;
    ownerId: string;
  }): Promise<Workspace>;

  getUserWorkspaces(
    userId: string
  ): Promise<Workspace[]>;

  getWorkspaceById(
    workspaceId: string
  ): Promise<Workspace | null>;

  updateWorkspace(
    workspaceId: string,
    name: string
  ): Promise<Workspace | null>;

  deleteWorkspace(
    workspaceId: string
  ): Promise<boolean>;

  // MEMBERS
  addMember(data: {
    workspaceId: string;
    userId: string;
    role?: "admin" | "member";
  }): Promise<WorkspaceMember>;

  getWorkspaceMembers(
    workspaceId: string
  ): Promise<WorkspaceMember[]>;

  removeMember(
    workspaceId: string,
    userId: string
  ): Promise<boolean>;

  updateMemberRole(
    workspaceId: string,
    userId: string,
    role: "admin" | "member"
  ): Promise<WorkspaceMember | null>;
}