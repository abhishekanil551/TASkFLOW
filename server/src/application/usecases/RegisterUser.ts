import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(name: string, email: string, password: string) {
    const existing = await this.userRepo.findByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

  await sendEmail(
    email,
    "Your OTP Code",
    `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #1a73e8; text-align: center;">TaskFlow</h2>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; border-radius: 8px; margin: 20px 0;">
        ${otp}
      </div>
      <p style="color: #555; text-align: center;">This code expires in <strong>50 sec</strong>.</p>
      <p style="font-size: 12px; color: #999; text-align: center; margin-top: 25px;">
        If you didn't request this, please ignore this email.
      </p>
    </div>
    `
  );
    
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
