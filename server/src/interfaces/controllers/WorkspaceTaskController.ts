import { Request, Response } from "express";

import { CreateWorkspaceTask } from "../../application/usecases/workspaceTasks/CreateWorkspaceTask";
import { GetWorkspaceTasks } from "../../application/usecases/workspaceTasks/GetWorkspaceTasks";
import { UpdateWorkspaceTask } from "../../application/usecases/workspaceTasks/UpdateWorkspaceTask";
import { DeleteWorkspaceTask } from "../../application/usecases/workspaceTasks/DeleteWorkspaceTask";

export class WorkspaceTaskController {
  constructor(
    private createWorkspaceTask: CreateWorkspaceTask,
    private getWorkspaceTasks: GetWorkspaceTasks,
    private updateWorkspaceTask: UpdateWorkspaceTask,
    private deleteWorkspaceTask: DeleteWorkspaceTask
  ) { }

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const workspaceId =
        typeof req.params.workspaceId ===
          "string"
          ? req.params.workspaceId
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!workspaceId) {
        return res.status(400).json({
          message:
            "Workspace id is required",
        });
      }

      const task =
        await this.createWorkspaceTask.execute(
          userId,
          {
            ...req.body,
            workspaceId,
          }
        );

      return res.status(201).json(
        task
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to create task",
      });
    }
  }

  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const workspaceId =
        typeof req.params.workspaceId ===
          "string"
          ? req.params.workspaceId
          : "";

      const page =
        Number(
          req.query.page || 1
        );

      const limit =
        Number(
          req.query.limit || 50
        );

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!workspaceId) {
        return res.status(400).json({
          message:
            "Workspace id is required",
        });
      }

      const tasks =
        await this.getWorkspaceTasks.execute(
          workspaceId,
          userId,
          page,
          limit
        );

      return res.status(200).json(
        tasks
      );
    } catch (error: any) {
      return res.status(403).json({
        message:
          error?.message ||
          "Failed to fetch tasks",
      });
    }
  }

  async update(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const taskId =
        typeof req.params.id ===
          "string"
          ? req.params.id
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          message:
            "Task id is required",
        });
      }

      const updated =
        await this.updateWorkspaceTask.execute(
          taskId,
          userId,
          req.body
        );

      return res.status(200).json(
        updated
      );
    } catch (error: any) {
      return res.status(403).json({
        message:
          error?.message ||
          "Failed to update task",
      });
    }
  }


  async addComment(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const taskId =
        typeof req.params.id ===
          "string"
          ? req.params.id
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          message: "Task id is required",
        });
      }

      const updated =
        await this.updateWorkspaceTask.execute(
          taskId,
          userId,
          {
            comment:
              req.body.message,
          }
        );

      return res.status(200).json(
        updated
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to add comment",
      });
    }
  }

  async addReply(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const taskId =
        typeof req.params.id ===
          "string"
          ? req.params.id
          : "";

      const commentId =
        typeof req.params.commentId ===
          "string"
          ? req.params.commentId
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          message: "Task id is required",
        });
      }

      if (!commentId) {
        return res.status(400).json({
          message:
            "Comment id is required",
        });
      }

      const updated =
        await this.updateWorkspaceTask.execute(
          taskId,
          userId,
          {
            commentId,
            reply:
              req.body.message,
          }
        );

      return res.status(200).json(
        updated
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to add reply",
      });
    }
  }

  async updateSubTask(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const taskId =
        typeof req.params.id ===
          "string"
          ? req.params.id
          : "";

      const subTaskId =
        typeof req.params.subTaskId ===
          "string"
          ? req.params.subTaskId
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          message: "Task id is required",
        });
      }

      if (!subTaskId) {
        return res.status(400).json({
          message:
            "Subtask id is required",
        });
      }

      const updated =
        await this.updateWorkspaceTask.execute(
          taskId,
          userId,
          {
            subTaskId,
            completed:
              req.body.completed,
          }
        );

      return res.status(200).json(
        updated
      );
    } catch (error: any) {
      return res.status(400).json({
        message:
          error?.message ||
          "Failed to update subtask",
      });
    }
  }
  

  async delete(
    req: Request,
    res: Response
  ) {
    try {
      const userId =
        typeof (req as any).userId ===
          "string"
          ? (req as any).userId
          : "";

      const taskId =
        typeof req.params.id ===
          "string"
          ? req.params.id
          : "";

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!taskId) {
        return res.status(400).json({
          message:
            "Task id is required",
        });
      }

      await this.deleteWorkspaceTask.execute(
        taskId,
        userId
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error: any) {
      return res.status(403).json({
        message:
          error?.message ||
          "Failed to delete task",
      });
    }
  }
}