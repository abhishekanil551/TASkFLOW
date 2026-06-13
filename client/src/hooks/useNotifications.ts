import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  notificationApi,
} from "../api/notification/NotificationApi";

export type Notification = {
  id: string;

  title: string;

  message: string;

  read: boolean;

  createdAt: string;

  type:
    | "task-assigned"
    | "task-updated"
    | "task-overdue";
};

export const useNotifications =
  () => {
    const [
      notifications,
      setNotifications,
    ] =
      useState<
        Notification[]
      >([]);

    const getNotifications =
      useCallback(
        async () => {
          const data =
            await notificationApi.getMyNotifications();

          const list =
            Array.isArray(
              data
            )
              ? data
              : [];

          for (const notification of list) {
            const alreadyShown =
              localStorage.getItem(
                `notification-${notification.id}`
              );

            if (
              !notification.read &&
              !alreadyShown
            ) {
              localStorage.setItem(
                `notification-${notification.id}`,
                "shown"
              );

              if (
                notification.type ===
                "task-assigned"
              ) {
                toast.success(
                  notification.message
                );
              }

              if (
                notification.type ===
                "task-updated"
              ) {
                toast(
                  notification.message,
                  {
                    icon: "📝",
                  }
                );
              }

              if (
                notification.type ===
                "task-overdue"
              ) {
                toast.error(
                  notification.message
                );
              }
            }
          }

          setNotifications(
            list
          );

          return list;
        },
        []
      );

    const markAsRead =
      useCallback(
        async (
          notificationId: string
        ) => {
          await notificationApi.markAsRead(
            notificationId
          );

          setNotifications(
            (
              prev
            ) =>
              prev.map(
                (
                  notification
                ) =>
                  notification.id ===
                  notificationId
                    ? {
                        ...notification,
                        read: true,
                      }
                    : notification
              )
          );
        },
        []
      );

    useEffect(() => {
      getNotifications();

      const interval =
        setInterval(
          getNotifications,
          10000
        );

      return () =>
        clearInterval(
          interval
        );
    }, [
      getNotifications,
    ]);

    return {
      notifications,
      getNotifications,
      markAsRead,
    };
  };