import { Bell } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useLayout } from "../../context/layout/useLayout";
import { useNotifications } from "../../hooks/useNotifications";

export default function Header() {
  const [showNotifications, setShowNotifications] =
    useState(false);

  const notificationRef =
    useRef<HTMLDivElement>(
      null
    );

  const { isCollapsed } =
    useLayout();

  const {
    notifications,
    markAsRead,
  } =
    useNotifications();

  useEffect(() => {
    const handleClickOutside =
      (
        event: MouseEvent
      ) => {
        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target as Node
          )
        ) {
          setShowNotifications(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (
            notification
          ) =>
            !notification.read
        ).length,
      [
        notifications,
      ]
    );

  const handleRead =
    async (
      notificationId: string
    ) => {
      try {
        await markAsRead(
          notificationId
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  const handleMarkAllRead =
    async () => {
      try {
        const unread =
          notifications.filter(
            (
              notification
            ) =>
              !notification.read
          );

        await Promise.all(
          unread.map(
            (
              notification
            ) =>
              markAsRead(
                notification.id
              )
          )
        );
      } catch (
        error
      ) {
        console.error(
          error
        );
      }
    };

  return (
    <header
      className={`fixed top-0 right-0 z-40 h-16 bg-gray-950 backdrop-blur-md transition-all duration-300 ${
        isCollapsed
          ? "left-20"
          : "left-54"
      }`}
    >
      <div className="flex items-center justify-end h-full mt-1 px-6">
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            onClick={() =>
              setShowNotifications(
                (
                  prev
                ) =>
                  !prev
              )
            }
            className="p-2 hover:bg-gray-800 rounded-lg relative"
          >
            <Bell className="w-5 h-5 text-gray-300" />

            {unreadCount >
              0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[18px]
                  h-[18px]
                  px-1
                  flex
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  text-white
                  text-[10px]
                  font-bold
                "
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              className="
                absolute
                right-0
                mt-3
                w-[380px]
                rounded-xl
                border
                border-gray-800
                bg-gray-950
                shadow-2xl
                overflow-hidden
              "
            >
              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-gray-800
                  flex
                  items-center
                  justify-between
                "
              >
                <span
                  className="
                    text-white
                    font-semibold
                  "
                >
                  Notifications
                </span>

                {unreadCount >
                  0 && (
                  <button
                    onClick={
                      handleMarkAllRead
                    }
                    className="
                      text-xs
                      text-cyan-400
                      hover:text-cyan-300
                    "
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div
                className="
                  max-h-[420px]
                  overflow-y-auto
                "
              >
                {notifications.length ===
                0 ? (
                  <div
                    className="
                      p-6
                      text-center
                      text-sm
                      text-gray-400
                    "
                  >
                    You're all caught up 🎉
                  </div>
                ) : (
                  notifications.map(
                    (
                      notification
                    ) => (
                      <button
                        key={
                          notification.id
                        }
                        onClick={() =>
                          handleRead(
                            notification.id
                          )
                        }
                        className={`
                          w-full
                          text-left
                          px-4
                          py-3
                          border-b
                          border-gray-800
                          bg-gray-900
                          hover:bg-gray-800
                          transition
                          ${
                            notification.read
                              ? "opacity-60"
                              : ""
                          }
                        `}
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
                          <div className="flex-1">
                            <div
                              className="
                                text-sm
                                font-medium
                                text-white
                              "
                            >
                              {
                                notification.title
                              }
                            </div>

                            <div
                              className="
                                text-xs
                                text-gray-300
                                mt-1
                              "
                            >
                              {
                                notification.message
                              }
                            </div>
                          </div>

                          {!notification.read && (
                            <div
                              className="
                                w-2
                                h-2
                                rounded-full
                                bg-cyan-500
                                mt-2
                              "
                            />
                          )}
                        </div>
                      </button>
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}