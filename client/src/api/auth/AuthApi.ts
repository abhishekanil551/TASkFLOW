import { api } from "../axios";

export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  verifyOtp: async (data: { email: string; otp: string }) => {
    const res = await api.post("/auth/verify-otp", data);
    return res.data;
  },

  resendOtp: async (data: { email: string }) => {
    const res = await api.post("/auth/resend-otp", data);
    return res.data;
  },

  login: async (data: {
    email: string;
    password: string;
    userAgent: string;
  }) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  googleLogin: async (data: {
    email: string;
    name: string;
    googleId: string;
  }) => {
    const res = await api.post("/auth/google-login", data);
    return res.data;
  },
};