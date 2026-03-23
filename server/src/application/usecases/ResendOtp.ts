import { UserRepository } from "../../domain/repositories/UserRepository";
import { generateOtp } from "../../utils/generateOtp";
import { sendEmail } from "../../utils/sendEmail";

export class ResendOtp {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error("User not found");

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    const otp = generateOtp();

    await sendEmail(
      email,
      "Your OTP Code",
      `

          <!-- Logo - perfectly centered -->
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 30px;">
            <div style="width: 42px; height: 42px; background: #06b6d4; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #0f172a; font-size: 30px; line-height: 1;">
              TF
            </div>
            <span style="font-size: 24px; font-weight: 700; color: #0f172a;">
              TaskFlow<span style="color: #06b6d4;">Pro</span>
            </span>
          </div>
          
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
    `,
    );

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepo.update(user);

    console.log("Resent OTP:", otp);

    return { message: "OTP email sent successfully" };
  }
}
