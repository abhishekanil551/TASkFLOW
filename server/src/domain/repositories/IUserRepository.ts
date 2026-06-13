import { normalUser } from "../entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<normalUser | null>;
  findById(id: string): Promise<normalUser | null>;
}