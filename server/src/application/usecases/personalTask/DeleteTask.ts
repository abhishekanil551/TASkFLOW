import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class DeleteTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}