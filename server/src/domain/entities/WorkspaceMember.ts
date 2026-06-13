export type WorkspaceMember = {
  id: string;

  workspaceId: string;
  userId: string;

  role: "admin" | "member";

  joinedAt: string;
};