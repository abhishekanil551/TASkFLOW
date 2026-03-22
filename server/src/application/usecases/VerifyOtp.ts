import { UserRepository } from "../../domain/repositories/UserRepository";

export class VerifyOtp {
    constructor( private userRepo: UserRepository) {}

    async execute(email: string, otp: string) {
        const user = await this.userRepo.findByEmail(email);
        
        if(!user) throw new Error("User not found");

        if (user.isVerified) {
            throw new Error("User already verified");
        }

        console.log("DB OTP:", user.otp);
        console.log("INPUT OTP:", otp);

        if (otp.length !== 6) {
            throw new Error("Invalid OTP format");
        }

        if(String(user.otp) !== String(otp)) throw new Error("Invalid otp");

        if (!user.otpExpires || new Date() > user.otpExpires) {
            throw new Error("OTP expired");
        }

        user.isVerified = true;
        user.otp = "";
        user.otpExpires = null as any;

        console.log(user)

        await this.userRepo.update(user);

        return {
            message: "User Verified",
            user
        }
    }
}