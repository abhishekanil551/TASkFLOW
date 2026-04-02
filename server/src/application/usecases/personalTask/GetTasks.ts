import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class GetTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(userId: string) {
    if (!userId) {
      throw new Error("User not found");
    }

    return this.repo.findByUserId(userId);
  }
}
