import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import { WorkspaceTaskRepository } from "../../infrastructure/repositories/WorkspaceTaskRepository";
import { WorkspaceRepository } from "../../infrastructure/repositories/WorkspaceRepository";
import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";

import { WorkspaceTaskController } from "../controllers/WorkspaceTaskController";

import { CreateWorkspaceTask } from "../../application/usecases/workspaceTasks/CreateWorkspaceTask";
import { GetWorkspaceTasks } from "../../application/usecases/workspaceTasks/GetWorkspaceTasks";
import { UpdateWorkspaceTask } from "../../application/usecases/workspaceTasks/UpdateWorkspaceTask";
import { DeleteWorkspaceTask } from "../../application/usecases/workspaceTasks/DeleteWorkspaceTask";

const router = Router({
  mergeParams: true,
});

const taskRepo =
  new WorkspaceTaskRepository();

const workspaceRepo =
  new WorkspaceRepository();

const notificationRepo =
  new NotificationRepository();

const createWorkspaceTask =
  new CreateWorkspaceTask(
    taskRepo,
    workspaceRepo,
    notificationRepo
  );

const getWorkspaceTasks =
  new GetWorkspaceTasks(
    taskRepo,
    workspaceRepo
  );

const updateWorkspaceTask =
  new UpdateWorkspaceTask(
    taskRepo,
    workspaceRepo,
    notificationRepo
  );

const deleteWorkspaceTask =
  new DeleteWorkspaceTask(
    taskRepo,
    workspaceRepo
  );

const controller =
  new WorkspaceTaskController(
    createWorkspaceTask,
    getWorkspaceTasks,
    updateWorkspaceTask,
    deleteWorkspaceTask
  );

router.post(
  "/",
  authMiddleware,
  controller.create.bind(
    controller
  )
);

router.get(
  "/",
  authMiddleware,
  controller.getAll.bind(
    controller
  )
);

router.patch(
  "/:id",
  authMiddleware,
  controller.update.bind(
    controller
  )
);

router.post(
  "/:id/comments",
  authMiddleware,
  controller.addComment.bind(
    controller
  )
);

router.post(
  "/:id/comments/:commentId/reply",
  authMiddleware,
  controller.addReply.bind(
    controller
  )
);

router.patch(
  "/:id/subtasks/:subTaskId",
  authMiddleware,
  controller.updateSubTask.bind(
    controller
  )
);

router.delete(
  "/:id",
  authMiddleware,
  controller.delete.bind(
    controller
  )
);


export default router;