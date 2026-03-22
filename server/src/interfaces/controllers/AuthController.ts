import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { RegisterUser } from "../../application/usecases/RegisterUser";
import { VerifyOtp } from "../../application/usecases/VerifyOtp";
import { ResendOtp } from "../../application/usecases/ResendOtp";
import { MongoUserRepository } from "../../infrastructure/repositories/MongoUserRepository";
import { LoginUser } from "../../application/usecases/LoginUser";

const repo = new MongoUserRepository();
const registerUser = new RegisterUser(repo);
const loginUser = new LoginUser(repo);
const verifyOtp = new VerifyOtp(repo);
const resendotp = new ResendOtp(repo);

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);
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
    const { email, password } = req.body;

    console.log(email, password);

    const result = await loginUser.execute(email, password);

    const token = jwt.sign({ id: result.user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

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
  res.clearCookie("token"); // this remove jwt cookie
  return res.json({ message: "Loggeed out" });
};
