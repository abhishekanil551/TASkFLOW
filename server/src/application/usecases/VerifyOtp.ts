import { UserRepository } from "../../domain/repositories/UserRepository";
import { sendEmail } from "../../utils/sendEmail";

export class VerifyOtp {
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, otp: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) throw new Error("User not found");

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    console.log("DB OTP:", user.otp);
    console.log("INPUT OTP:", otp);

    if (otp.length !== 6) {
      throw new Error("Invalid OTP format");
    }

    if (String(user.otp) !== String(otp)) throw new Error("Invalid otp");

    if (!user.otpExpires || new Date() > user.otpExpires) {
      throw new Error("OTP expired");
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = null as any;

    console.log(user);

    await this.userRepo.update(user);

    await sendEmail(
      user.email,
      "Welcome to TaskFlow 🎉",
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

        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0;">
          <h2 style="color: #1a73e8; text-align: center;">Welcome to TaskFlow!</h2>
          <p style="font-size: 16px; color: #333; text-align: center;">
            Your account has been successfully verified.
          </p>
        <!-- <p style="text-align: center; margin-top: 25px;">
            <a href="https://yourapp.com/login" 
              style="background: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
                </a>
              </p> -->
              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                Thank you for joining TaskFlow.
              </p>
            </div>
        `,
      );

    return {
      message: "User Verified",
      user,
    };
  }
}
