export interface AuthRepository {
    register(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<{ success: boolean; userId: string }>;

    verifyOtp(data: { email: string; otp: string }): Promise<{ message:string }>;

    resendOtp(data: {email: string}): Promise<{ message:string }>;

    login(data: {email: string; password:string; userAgent: string}): Promise<{message: string}>;

    googleLogin(data: {email: string; name: string; googleId: string; }): Promise<{ message: string }>;
}