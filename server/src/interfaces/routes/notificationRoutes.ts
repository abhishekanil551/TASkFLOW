import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware";

import { NotificationRepository } from "../../infrastructure/repositories/NotificationRepository";

import { NotificationController } from "../controllers/NotificationController";

import { GetUserNotifications } from "../../application/usecases/notifications/GetUserNotifications";
import { MarkNotificationRead } from "../../application/usecases/notifications/MarkNotificationRead";

const router =
  Router();

const notificationRepo =
  new NotificationRepository();

const getUserNotifications =
  new GetUserNotifications(
    notificationRepo
  );

const markNotificationRead =
  new MarkNotificationRead(
    notificationRepo
  );

const controller =
  new NotificationController(
    getUserNotifications,
    markNotificationRead
  );

router.get(
  "/",
  authMiddleware,
  controller.getMyNotifications.bind(
    controller
  )
);

router.patch(
  "/:id/read",
  authMiddleware,
  controller.markAsRead.bind(
    controller
  )
);

export default router;