import type { AuthRepository } from "../../domain/repositories/AuthRepository";

export const resendOtpUser = async (
    repo: AuthRepository,
    data: {email: string}
) => {
    return repo.resendOtp(data);
}