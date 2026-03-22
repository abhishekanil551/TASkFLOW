import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { User } from "../../domain/entities/User";

export class MongoUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const created = await UserModel.create(user);

    return {
      id: created._id.toString(),
      name: created.name!,
      email: created.email!,
      password: created.password!,
      otp: created.otp!,
      otpExpires: created.otpExpires!,
      isVerified: created.isVerified!,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name!,
      email: user.email!,
      password: user.password!,
      otp: user.otp!,
      otpExpires: user.otpExpires!,
      isVerified: user.isVerified!,
    };
  }

  async update(user: any): Promise<User | null> {
    return UserModel.findByIdAndUpdate(user.id, user, {
      returnDocument: "after",
    });
  }
}
