import { api } from "../../api/axios";
import type { AuthRepository } from "../../domain/repositories/AuthRepository";


export class AuthApi implements AuthRepository{

    async register(data: {
        name: string;
        email: string;
        password: string;
    }){
        const res = await api.post("/auth/register",data);
        return res.data;
    }

    async verifyOtp(data: { email: string; otp: string }): Promise<{ message:string }> {
        const res = await api.post("/auth/verify-otp", data);
        return res.data;
    }

    async resendOtp(data: { email: string; }): Promise<{ message: string; }> {
        const res = await api.post("/auth/resend-otp", data);
        return res.data;
    }

    async login(data: { email: string; password: string; userAgent: string;}): Promise<{ message: string; }> {
        const res = await api.post("/auth/login", data);
        return res.data;
    }

    async logout() {
        const res = await api.post('/auth/logout');
        return res.data;
    }

    async getMe(){
        const res = await api.get("/auth/me")
        return res.data;
    }
}