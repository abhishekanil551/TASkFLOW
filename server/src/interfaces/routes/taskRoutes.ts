import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { PersonalTaskController } from "../controllers/PersonalTaskController";
import { AddTask } from "../../application/usecases/personalTask/AddTask";
import { GetTask } from "../../application/usecases/personalTask/GetTasks";
import { ToggleTimer } from "../../application/usecases/personalTask/ToggleTimer";
import { CompleteTask } from "../../application/usecases/personalTask/CompleteTask";
import { UpdateTask } from "../../application/usecases/personalTask/UpdateTask";
import { DeleteTask } from "../../application/usecases/personalTask/DeleteTask";
import { PersonalTaskRepository } from "../../infrastructure/repositories/PersonalTaskRepository";
import { GetAllTask } from "../../application/usecases/personalTask/GetAllTask";


const repo = new PersonalTaskRepository();

const controller = new PersonalTaskController(
  new AddTask(repo),
  new GetTask(repo),
  new ToggleTimer(repo),
  new CompleteTask(repo),
  new UpdateTask(repo),
  new DeleteTask(repo),
  new GetAllTask(repo)
);

const router = Router();

router.post("/", authMiddleware, controller.addtask.bind(controller));
router.get("/", authMiddleware, controller.gettask.bind(controller));
router.patch("/:id", authMiddleware, controller.updateTask.bind(controller));
router.patch("/:id/timer", authMiddleware, controller.toggletimer.bind(controller));
router.patch("/:id/complete", authMiddleware, controller.completetask.bind(controller));
router.delete("/:id", authMiddleware, controller.deleteTask.bind(controller));
router.get("/all", authMiddleware, controller.getalltask.bind(controller));
export default router;
