import { useCallback } from "react";
import { authApi } from "../api/auth/AuthApi";

export const useAuth = () => {
  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    return authApi.register(data);
  }, []);

  const login = useCallback(async (data: {
    email: string;
    password: string;
    userAgent: string;
  }) => {
    return authApi.login(data);
  }, []);

  const verifyOtp = useCallback(async (data: {
    email: string;
    otp: string;
  }) => {
    return authApi.verifyOtp(data);
  }, []);

  const resendOtp = useCallback(async (data: { email: string }) => {
    return authApi.resendOtp(data);
  }, []);

  const logout = useCallback(async () => {
    return authApi.logout();
  }, []);

  const getMe = useCallback(async () => {
    return authApi.getMe();
  }, []);

  const loginWithGoogle = useCallback(async (data: {
    email: string;
    name: string;
    googleId: string;
  }) => {
    return authApi.googleLogin(data);
  }, []);

  return {
    register,
    login,
    verifyOtp,
    resendOtp,
    logout,
    getMe,
    loginWithGoogle,
  };
};