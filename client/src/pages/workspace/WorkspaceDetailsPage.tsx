import { useState, useMemo, useEffect } from "react";

import {
  CheckSquare,
  Users,
  Settings,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

import type {
  Workspace,
  Task,
  UserRole,
  TaskCreateInput,
  TaskUpdateInput,
} from "../../types/workspace";

import { TasksTab } from "./TasksTab";
import { MembersTab } from "./MembersTab";
import { ManageTab } from "./ManageTab";

type TabType =
  | "tasks"
  | "members"
  | "manage"
  | "analytics";

interface WorkspaceDetailsProps {
  workspace: Workspace;

  currentUserId: string;

  currentUserRole: UserRole;

  onBack: () => void;

  onUpdateWorkspace: (
    data: {
      name: string;
      description: string;
    }
  ) => Promise<void> | void;

  onDeleteWorkspace: () => Promise<void> | void;

  onAddTask: (
    task: TaskCreateInput
  ) => Promise<void> | void;

  onEditTask: (
    taskId: string,
    task: TaskUpdateInput
  ) => Promise<void> | void;

  onDeleteTask: (
    taskId: string
  ) => Promise<void> | void;

  onAddMember: (
    email: string,
    role: UserRole
  ) => Promise<void> | void;

  onRemoveMember: (
    memberId: string
  ) => Promise<void> | void;

  onUpdateMemberRole: (
    memberId: string,
    role: UserRole
  ) => Promise<void> | void;
}

export function WorkspaceDetails({
  workspace,
  currentUserId,
  currentUserRole,
  onBack,
  onUpdateWorkspace,
  onDeleteWorkspace,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onAddMember,
  onRemoveMember,
  onUpdateMemberRole,
}: WorkspaceDetailsProps) {
  const isAdmin =
    currentUserRole ===
    "admin";

  const [
    activeTab,
    setActiveTab,
  ] = useState<TabType>(
    "tasks"
  );

  useEffect(() => {
    if (
      !isAdmin &&
      (activeTab ===
        "manage" ||
        activeTab ===
        "analytics")
    ) {
      setActiveTab(
        "tasks"
      );
    }
  }, [
    isAdmin,
    activeTab,
  ]);

  const safeWorkspace =
    useMemo(
      () => ({
        ...workspace,

        currentUserId,

        currentUserRole,

        tasks:
          workspace.tasks ||
          [],

        members:
          workspace.members ||
          [],
      }),
      [
        workspace,
        currentUserId,
        currentUserRole,
      ]
    );

  const analytics =
    useMemo(() => {
      return safeWorkspace.members.map(
        (
          member
        ) => {
          const memberTasks =
            safeWorkspace.tasks.filter(
              (
                task
              ) =>
                task.assignedTo.includes(
                  member.userId ||
                  member.id
                )
            );

          const completed =
            memberTasks.filter(
              (
                task
              ) =>
                task.status ===
                "completed"
            ).length;

          return {
            ...member,

            total:
              memberTasks.length,

            completed,

            pending:
              memberTasks.length -
              completed,
          };
        }
      );
    }, [
      safeWorkspace,
    ]);

  const tabs =
    useMemo(() => {
      const baseTabs = [
        {
          id: "tasks" as TabType,
          label: "Tasks",
          icon: CheckSquare,
        },
        {
          id: "members" as TabType,
          label: "Members",
          icon: Users,
        },
      ];

      if (
        isAdmin
      ) {
        baseTabs.push(
          {
            id: "analytics" as TabType,
            label:
              "Analytics",
            icon: BarChart3,
          },
          {
            id: "manage" as TabType,
            label:
              "Manage",
            icon: Settings,
          }
        );
      }

      return baseTabs;
    }, [isAdmin]);

  const renderTabContent =
    () => {
      switch (
      activeTab
      ) {
        case "tasks":
          return (
            <TasksTab
              workspace={
                safeWorkspace
              }
              onAddTask={async (
                task
              ) => {
                await Promise.resolve(
                  onAddTask(
                    task
                  )
                );
              }}
              onEditTask={async (
                taskId,
                task
              ) => {
                await Promise.resolve(
                  onEditTask(
                    taskId,
                    task
                  )
                );
              }}
              onDeleteTask={async (
                taskId
              ) => {
                await Promise.resolve(
                  onDeleteTask(
                    taskId
                  )
                );
              }}
            />
          );

        case "members":
          return (
            <MembersTab
              members={
                safeWorkspace.members
              }
              currentUserId={
                currentUserId
              }
              currentUserRole={
                currentUserRole
              }
              onAddMember={
                onAddMember
              }
              onRemoveMember={
                onRemoveMember
              }
              onUpdateRole={
                onUpdateMemberRole
              }
            />
          );

        case "analytics":
          if (
            !isAdmin
          ) {
            return null;
          }

          return (
            <div className="space-y-4">
              {analytics.map(
                (
                  member
                ) => (
                  <div
                    key={
                      member.id
                    }
                    className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-white font-medium">
                          {member.name ||
                            member.email}
                        </h3>

                        <p className="text-sm text-zinc-400">
                          {
                            member.role
                          }
                        </p>
                      </div>

                      <div>
                        {
                          member.pending
                        }{" "}
                        Pending
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          );

        case "manage":
          if (
            !isAdmin
          ) {
            return null;
          }

          return (
            <ManageTab
              workspace={
                safeWorkspace
              }
              onUpdateWorkspace={
                onUpdateWorkspace
              }
              onDeleteWorkspace={
                onDeleteWorkspace
              }
            />
          );

        default:
          return null;
      }
    };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="shrink-0 border-b border-zinc-800">
        <div className="px-6 py-4">
          <button
            onClick={
              onBack
            }
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-3"
          >
            <ArrowLeft className="w-4 h-4" />

            <span className="text-sm">
              Back to
              workspaces
            </span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
              {safeWorkspace.name
                ?.charAt(
                  0
                )
                ?.toUpperCase() ||
                "W"}
            </div>

            <div>
              <h1 className="text-xl font-semibold text-white">
                {
                  safeWorkspace.name
                }
              </h1>

              {safeWorkspace.description && (
                <p className="text-sm text-zinc-400 mt-0.5">
                  {
                    safeWorkspace.description
                  }
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 flex gap-1">
          {tabs.map(
            (
              tab
            ) => {
              const Icon =
                tab.icon;

              return (
                <button
                  key={
                    tab.id
                  }
                  onClick={() =>
                    setActiveTab(
                      tab.id
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${activeTab ===
                    tab.id
                    ? "text-white border-blue-500"
                    : "text-zinc-400 border-transparent"
                    }`}
                >
                  <Icon className="w-4 h-4" />

                  {
                    tab.label
                  }
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-6 scrollbar-hide">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}