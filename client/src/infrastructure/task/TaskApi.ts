import { api } from "../../api/axios";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { Task } from "../../domain/entities/Task";

export class TaskApi implements TaskRepository {
  async addTask(data: Task): Promise<Task> {
    try {
      const res = await api.post("/tasks", data);
      return res.data;
    } catch (err) {
      console.error("❌ Add Task API failed:", err);
      throw err;
    }
  }

  async updateTask(id: string, data: Task): Promise<Task> {
    try {
      const res = await api.patch(`/tasks/${id}`, data);
      return res.data;
    } catch (err) {
      console.error("❌ Update Task API failed:", err);
      throw err;
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const res = await api.get("/tasks");
      return res.data;
    } catch (err) {
      console.error("❌ Get Tasks API failed:", err);
      throw err;
    }
  }

  async toggleTimer(id: string): Promise<Task> {
    try {
      const res = await api.patch(`/tasks/${id}/timer`);
      return res.data;
    } catch (err) {
      console.error("❌ Toggle Timer API failed:", err);
      throw err;
    }
  }

  async completeTask(id: string): Promise<Task> {
    try {
      const res = await api.patch(`/tasks/${id}/complete`);
      return res.data;
    } catch (err) {
      console.error("❌ Complete Task API failed:", err);
      throw err;
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("❌ Delete Task API failed:", err);
      throw err;
    }
  }

  async getAllTasks(
    page = 1,
    limit = 10,
    filters?: {
      search?: string;
      status?: string;
      priority?: string;
    },
  ) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
    });

    const res = await api.get(`/tasks/all?${params.toString()}`);
    return res.data;
  }
}
