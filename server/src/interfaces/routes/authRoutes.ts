import { Router } from "express"
import { register, login, verifyotp, resendOtp, logout, googleLogin } from "../controllers/AuthController"

const router = Router()

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyotp);
router.post("/resend-otp",resendOtp);
router.post("/logout", logout);
router.post("/google-login",googleLogin);

export default router