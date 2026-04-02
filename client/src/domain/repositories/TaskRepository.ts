import type { Task } from "../entities/Task";

export interface TaskRepository {
  addTask(data: Task): Promise<Task>;

  getTasks(): Promise<Task[]>;

  toggleTimer(id: string): Promise<Task>;

  completeTask(id: string): Promise<Task>;

  deleteTask(id: string): Promise<void>;

}