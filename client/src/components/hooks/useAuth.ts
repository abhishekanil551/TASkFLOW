import { AuthApi } from "../../infrastructure/auth/AuthApi";
import { registerUser } from "../../application/auth/register";
import { verifyOtpUser } from "../../application/auth/verifyOtp";
import { resendOtpUser } from "../../application/auth/resendOtp";
import { userLogin } from "../../application/auth/userLogin";

const repo = new AuthApi();

export const useAuth = () => {
  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    return registerUser(repo, data);
  };

  const loginWithGoogle = async (data: {
    email: string;
    name: string;
    googleId: string;
  }) => {
    return repo.googleLogin(data);
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    return verifyOtpUser(repo, data);
  };

  const resendOtp = async (data: { email: string }) => {
    return resendOtpUser(repo, data);
  };

  const login = async (data: {
    email: string;
    password: string;
    userAgent: string;
  }) => {
    return userLogin(repo, data);
  };

  const logout = async () => {
    return repo.logout();
  };

  const getMe = async () => {
    return repo.getMe();
  };

  return { register, verifyOtp, resendOtp, login, logout, getMe, loginWithGoogle };
};
