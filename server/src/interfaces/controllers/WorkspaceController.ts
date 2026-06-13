import { Request, Response } from "express";
import { CreateWorkspace } from "../../application/usecases/workspaces/CreateWorkspace";
import { GetUserWorkspaces } from "../../application/usecases/workspaces/GetUserWorkspaces";
import { AddMember } from "../../application/usecases/workspaces/AddMember";
import { GetWorkspaceDetails } from "../../application/usecases/workspaces/GetWorkspaceDetails";
import { ManageWorkspace } from "../../application/usecases/workspaces/ManageWorkspace";

export class WorkspaceController {
  constructor(
    private createWorkspace: CreateWorkspace,
    private getUserWorkspaces: GetUserWorkspaces,
    private addMember: AddMember,
    private getWorkspaceDetails: GetWorkspaceDetails,
    private manageWorkspace: ManageWorkspace,
  ) { }

  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { name, members } = req.body;

      const workspace = await this.createWorkspace.execute({
        name,
        ownerId: userId,
        members: members || [],
      });

      return res.status(201).json(workspace);
    } catch {
      return res.status(400).json({ message: "Failed to create workspace" });
    }
  }

  async updateWorkspace(
    req: Request,
    res: Response
  ) {
    try {
      const adminId =
        (req as any).userId;

      const { id } =
        req.params;

      if (
        !id ||
        Array.isArray(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid workspace id",
        });
      }

      const { name } =
        req.body;

      const workspace =
        await this.manageWorkspace.updateWorkspace(
          id,
          adminId,
          name
        );

      return res.json(
        workspace
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Failed to update workspace",
      });
    }
  }

  async deleteWorkspace(
    req: Request,
    res: Response
  ) {
    try {
      const adminId =
        (req as any).userId;

      const { id } =
        req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          message:
            "Invalid workspace id",
        });
      }

      await this.manageWorkspace.deleteWorkspace(
        id,
        adminId
      );

      return res.json({
        success: true,
      });
    } catch {
      return res.status(403).json({
        message:
          "Only admin can delete workspace",
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const workspaces = await this.getUserWorkspaces.execute(userId);

      return res.json(workspaces);
    } catch {
      return res.status(500).json({ message: "Failed to fetch workspaces" });
    }
  }

  async addMemberToWorkspace(
    req: Request,
    res: Response
  ) {
    try {
      const adminId =
        (req as any).userId;

      const {
        workspaceId,
        email,
        role,
      } = req.body;

      const member =
        await this.addMember.execute(
          workspaceId,
          adminId,
          email,
          role
        );

      return res.status(201).json(
        member
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error.message ||
          "Failed to add member",
      });
    }
  }

  async removeMember(
    req: Request,
    res: Response
  ) {
    try {
      const adminId =
        (req as any).userId;

      const {
        workspaceId,
        memberId,
      } = req.body;

      const result =
        await this.manageWorkspace.removeMember(
          workspaceId,
          adminId,
          memberId
        );

      return res.json({
        success: result,
      });
    } catch {
      return res.status(403).json({
        message:
          "Only admin can remove members",
      });
    }
  }

  async updateMemberRole(
    req: Request,
    res: Response
  ) {
    try {
      const adminId =
        (req as any).userId;

      const {
        workspaceId,
        memberId,
        role,
      } = req.body;

      const updated =
        await this.manageWorkspace.updateMemberRole(
          workspaceId,
          adminId,
          memberId,
          role
        );

      return res.json(
        updated
      );
    } catch {
      return res.status(403).json({
        message:
          "Only admin can update roles",
      });
    }
  }


  async getById(
    req: Request,
    res: Response
  ) {
    try {
      const { id } =
        req.params;

      const userId =
        (req as any).userId;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          message:
            "Invalid workspace id",
        });
      }

      const workspace =
        await this.getWorkspaceDetails.execute(
          id,
          userId
        );

      return res.json(
        workspace
      );
    } catch {
      return res.status(404).json({
        message:
          "Workspace not found",
      });
    }
  }
}