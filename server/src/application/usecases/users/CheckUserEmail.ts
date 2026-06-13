import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class CheckUserEmail {
  constructor(private userRepo: IUserRepository) {}

  async execute(email: string) {
    if (!email || email.trim() === "") {
      throw new Error("Email required");
    }

    const user = await this.userRepo.findByEmail(email);

    return {
      exists: !!user,
      name: user?.name || null,
    };
  }
}