import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export const verifyOtpUser = async (
  repo: AuthRepository,
  data: { email: string; otp: string }
) => {
  return repo.verifyOtp(data);
};