import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class GetAllTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(
    userId: string,
    page: number,
    limit: number,
    filters: {
      search?: string;
      status?: string;
      priority?: string;
    },
  ) {
    return this.repo.findByUserIdPaginated(userId, page, limit, filters);
  }
}
