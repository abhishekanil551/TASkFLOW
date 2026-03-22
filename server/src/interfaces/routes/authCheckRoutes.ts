import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) =>{
    res.json({
        message:"You are authenticated",
        userId: (req as any).userId
    });
});

export default router