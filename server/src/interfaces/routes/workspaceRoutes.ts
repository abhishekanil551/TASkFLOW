import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

// REPOSITORIES
import { WorkspaceRepository } from "../../infrastructure/repositories/WorkspaceRepository";
import { WorkspaceTaskRepository } from "../../infrastructure/repositories/WorkspaceTaskRepository";
import { MongoUserRepo } from "../../infrastructure/repositories/MongoUserRepo";

// USE CASES
import { CreateWorkspace } from "../../application/usecases/workspaces/CreateWorkspace";
import { GetUserWorkspaces } from "../../application/usecases/workspaces/GetUserWorkspaces";
import { AddMember } from "../../application/usecases/workspaces/AddMember";
import { GetWorkspaceDetails } from "../../application/usecases/workspaces/GetWorkspaceDetails";
import { ManageWorkspace } from "../../application/usecases/workspaces/ManageWorkspace";

// CONTROLLER
import { WorkspaceController } from "../controllers/WorkspaceController";

import workspaceTaskRoutes from "./workspaceTaskRoutes";

const router = Router();

// REPOSITORY INSTANCES
const workspaceRepo =
  new WorkspaceRepository();

const taskRepo =
  new WorkspaceTaskRepository();

const userRepo =
  new MongoUserRepo();

// USECASE INSTANCES
const createWorkspace =
  new CreateWorkspace(
    workspaceRepo,
    userRepo
  );

const getUserWorkspaces =
  new GetUserWorkspaces(
    workspaceRepo
  );

const addMember =
  new AddMember(
    workspaceRepo,
    userRepo
  );

const getWorkspaceDetails =
  new GetWorkspaceDetails(
    workspaceRepo,
    taskRepo
  );

const manageWorkspace =
  new ManageWorkspace(
    workspaceRepo
  );

// CONTROLLER INSTANCE
const controller =
  new WorkspaceController(
    createWorkspace,
    getUserWorkspaces,
    addMember,
    getWorkspaceDetails,
    manageWorkspace
  );

// WORKSPACE ROUTES

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

router.get(
  "/:id",
  authMiddleware,
  controller.getById.bind(
    controller
  )
);

router.patch(
  "/:id",
  authMiddleware,
  controller.updateWorkspace.bind(
    controller
  )
);

router.delete(
  "/:id",
  authMiddleware,
  controller.deleteWorkspace.bind(
    controller
  )
);

// MEMBER ROUTES
router.post(
  "/member",
  authMiddleware,
  controller.addMemberToWorkspace.bind(
    controller
  )
);

router.delete(
  "/member/remove",
  authMiddleware,
  controller.removeMember.bind(
    controller
  )
);

router.patch(
  "/member-role",
  authMiddleware,
  controller.updateMemberRole.bind(
    controller
  )
);



export default router;