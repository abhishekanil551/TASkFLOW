import bcrypt from "bcrypt";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(name: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    console.log(otp);

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    if (existing) {
      if (existing.isVerified) {
        throw new Error("User already exists");
      }

      existing.name = name;
      existing.password = hashedPassword;
      existing.otp = otp;
      existing.otpExpires = otpExpires;

      await this.userRepo.update(existing);

      return { message: "OTP resent" };
    }

    // 🔥 CASE 2: new user
    return this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false,
    });
  }
}