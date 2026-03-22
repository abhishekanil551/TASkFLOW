import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";

export class ResendOtp {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error("User not found");

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepo.update(user);

    console.log("Resent OTP:", otp);

    return { message: "OTP resent" };
  }
}
