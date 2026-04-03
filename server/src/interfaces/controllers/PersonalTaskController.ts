import { Request, Response } from "express";
import { AddTask } from "../../application/usecases/personalTask/AddTask";
import { GetTask } from "../../application/usecases/personalTask/GetTasks";
import { ToggleTimer } from "../../application/usecases/personalTask/ToggleTimer";
import { CompleteTask } from "../../application/usecases/personalTask/CompleteTask";
import { UpdateTask } from "../../application/usecases/personalTask/UpdateTask";
import { DeleteTask } from "../../application/usecases/personalTask/DeleteTask";
import { GetAllTask } from "../../application/usecases/personalTask/GetAllTask";

export class PersonalTaskController {
  constructor(
    private addTask: AddTask,
    private getTask: GetTask,
    private toggleTimer: ToggleTimer,
    private completeTask: CompleteTask,
    private updateTaskUseCase: UpdateTask,
    private deleteTaskuseCase: DeleteTask,
    private getAllTask: GetAllTask,
  ) {}

  async addtask(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      console.log(req.body, userId);
      const task = await this.addTask.execute({
        ...req.body,
        userId,
      });

      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid task ID" });
      }
      const task = await this.updateTaskUseCase.execute(id, req.body);

      return res.json(task);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async gettask(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const task = await this.getTask.execute(userId);

      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getalltask(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const search = String(req.query.search || "");
      const status = String(req.query.status || "all");
      const priority = String(req.query.priority || "all");

      const result = await this.getAllTask.execute(userId, page, limit, {
        search,
        status,
        priority,
      });

      return res.json(result);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async toggletimer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log(id);
      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await this.toggleTimer.execute(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async completetask(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const task = await this.completeTask.execute(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      return res.json(task);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid task ID" });
      }

      const success = await this.deleteTaskuseCase.execute(id);

      if (!success) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error("❌ deleteTask:", error);
      return res.status(500).json({ message: error.message });
    }
  }
}
