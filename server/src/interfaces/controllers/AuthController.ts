import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import { sendEmail } from "../../utils/sendEmail";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { VerifyOtp } from "../../application/usecases/VerifyOtp";
import { ResendOtp } from "../../application/usecases/ResendOtp";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { LoginUser } from "../../application/usecases/LoginUser";
import { GoogleLogin } from "../../application/usecases/GoogleLogin";

const repo = new MongoUserRepository();
const registerUser = new RegisterUser(repo);
const loginUser = new LoginUser(repo);
const verifyOtp = new VerifyOtp(repo);
const resendotp = new ResendOtp(repo);
const googlelogin = new GoogleLogin(repo);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser.execute(name, email, password);
    res.status(200).json(user);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, userAgent } = req.body;


    const result = await loginUser.execute(email, password);

    const token = jwt.sign({ id: result.user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    const parser = new UAParser(userAgent);
    const ua = parser.getResult();

    const device = `${ua.os.name} · ${ua.browser.name}`;
    const ip = req.ip;

    // 🔥 SEND EMAIL - Login Alert
    await sendEmail(
      email,
      "New Login Detected",
      `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; background: #ffffff; border-radius: 12px;">

          <!-- Logo - perfectly centered -->
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 30px;">
            <div style="width: 42px; height: 42px; background: #06b6d4; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #0f172a; font-size: 30px; line-height: 1;">
              TF
            </div>
            <span style="font-size: 24px; font-weight: 700; color: #0f172a;">
              TaskFlow<span style="color: #06b6d4;">Pro</span>
            </span>
          </div>

          <!-- Header -->
          <h2 style="color: #d93025; text-align: center;">New Login Detected</h2>
          
          <!-- Details -->
          <p style="font-size: 16px; color: #333;">
            We noticed a new login to your TaskFlow account:
          </p>
          
          <p style="background: #f8f9fa; padding: 15px; border-radius: 8px; color: #444;">
            <strong>Device:</strong> ${device}<br>
            <strong>IP Address:</strong> ${ip}<br>
            <strong>Time:</strong> ${new Date().toLocaleString()}
          </p>

          <!-- Footer -->
          <p style="font-size: 13px; color: #666; text-align: center; margin-top: 25px;">
            If this wasn't you, please secure your account immediately.
          </p>
          
        </div>
      `,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // change this to true in production (HTTPS)
      sameSite: "lax",
    });

    res.status(200).json({ message: "Login successful", user: result.user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({ message });
  }
};

export const verifyotp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOtp.execute(email, otp);

    const token = jwt.sign({ id: result.user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      message: "User Verified",
      user: result.user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({ message });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await resendotp.execute(email);
    console.log("form controller", email);
    res.status(200).json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({ message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.json({ message: "Loggeed out" });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const result = await googlelogin.execute(email, name);

    const { user } = result;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({ message: "Google login success" });
  } catch (error) {
    console.log("🔥 ERROR:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({ message });
  }
};
