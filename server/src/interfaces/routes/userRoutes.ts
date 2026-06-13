import { Router } from "express";
import { MongoUserRepo } from "../../infrastructure/repositories/MongoUserRepo";
import { CheckUserEmail } from "../../application/usecases/users/CheckUserEmail";
import { UserController } from "../controllers/UserController";

const router = Router();

const userRepo = new MongoUserRepo();
const usecase = new CheckUserEmail(userRepo);
const controller = new UserController(usecase);

router.get("/check-email", controller.checkEmail.bind(controller));

export default router;