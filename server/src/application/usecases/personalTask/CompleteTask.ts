import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class CompleteTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(taskId: string) {
    const task = await this.repo.findById(taskId);

    if (!task) {
      throw new Error("Task not found");
    }
    const today = new Date().toISOString().split("T")[0];

    return this.repo.update(taskId, {
      status: "completed",
      isTimerRunning: false,
      lastCompletedDate: today,
    });
  }
}
