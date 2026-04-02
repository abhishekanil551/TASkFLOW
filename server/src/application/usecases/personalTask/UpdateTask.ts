import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class UpdateTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(id: string, data: any) {

    if (!id) {
      throw new Error("Task ID required");
    }

    if (data.title && data.title.trim().length < 3) {
      throw new Error("Title too short");
    }

    if (data.type === "recurring" && (!data.days || data.days.length === 0)) {
      throw new Error("Select at least one day");
    }

    const updated = await this.repo.update(id, data);

    if (!updated) {
      throw new Error("Task not found");
    }

    return updated;
  }
}