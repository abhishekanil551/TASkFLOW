import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class ToggleTimer {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(taskId: string) {
    const task = await this.repo.findById(taskId);
    console.log(task)
    if (!task) {
      throw new Error("Task not found");
    }

    const updated = await this.repo.updateTimer(
      taskId,
      task.timeSpent,
      !task.isTimerRunning
    );

    return updated;
  }
}
