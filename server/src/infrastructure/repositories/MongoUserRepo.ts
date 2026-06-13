import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserModel } from "../models/UserModel";
import { normalUser } from "../../domain/entities/User";

export class MongoUserRepo implements IUserRepository {
  async findByEmail(email: string): Promise<normalUser | null> {
    const user = await UserModel.findOne({ email });

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }

  async findById(id: string): Promise<normalUser | null> {
    const user = await UserModel.findById(id);

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}