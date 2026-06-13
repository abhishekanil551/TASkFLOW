import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Edit3 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { WorkspaceDetails } from "./workspace/WorkspaceDetailsPage";

import { useWorkspace } from "../hooks/useWorkspace";
import { useUser } from "../hooks/useUser";

import { WorkspaceModal } from "../components/modals/WorkspaceModal";
import { DeleteWorkspaceModal } from "../components/modals/DeleteWorkspaceModal";

import type {
  Workspace,
  UserRole,
  TaskCreateInput,
  TaskUpdateInput,
} from "../types/workspace";

export const Workspaces = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [workspaces, setWorkspaces] =
    useState<Workspace[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [selectedId, setSelectedId] =
    useState<string | null>(
      null
    );

  const [
    selectedWorkspace,
    setSelectedWorkspace,
  ] = useState<Workspace | null>(
    null
  );

  const [showModal, setShowModal] =
    useState(false);

  const [mode, setMode] =
    useState<"add" | "edit">(
      "add"
    );

  const [
    editingWorkspace,
    setEditingWorkspace,
  ] = useState<Workspace | null>(
    null
  );

  const [deleteTarget, setDeleteTarget] =
    useState<Workspace | null>(
      null
    );

  const {
    getWorkspaces,
    getWorkspaceById,

    createWorkspace,
    updateWorkspace,
    deleteWorkspace,

    addTask,
    updateTask,
    deleteTask,

    addMember,
    removeMember,
    updateMemberRole,
  } = useWorkspace();

  const { checkUser } =
    useUser();

  useEffect(() => {
    const pathParts =
      location.pathname.split(
        "/"
      );

    if (
      pathParts[1] ===
        "workspaces" &&
      pathParts[2]
    ) {
      setSelectedId(
        pathParts[2]
      );
    } else {
      setSelectedId(
        null
      );
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchWorkspaces =
      async () => {
        setLoading(true);

        try {
          const data =
            await getWorkspaces();

          setWorkspaces(
            data || []
          );
        } catch (error) {
          console.error(
            "Failed to fetch workspaces",
            error
          );

          setWorkspaces(
            []
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchWorkspaces();
  }, [getWorkspaces]);

  useEffect(() => {
    const fetchWorkspaceDetails =
      async () => {
        if (!selectedId) {
          setSelectedWorkspace(
            null
          );

          return;
        }

        try {
          const fullWorkspace =
            await getWorkspaceById(
              selectedId
            );

          setSelectedWorkspace(
            fullWorkspace
          );
        } catch (error) {
          console.error(
            "Failed to fetch workspace details",
            error
          );

          setSelectedWorkspace(
            null
          );
        }
      };

    fetchWorkspaceDetails();
  }, [
    selectedId,
    getWorkspaceById,
  ]);

  const currentUserRole: UserRole =
    selectedWorkspace?.currentUserRole ||
    "member";

  const currentUserId =
    selectedWorkspace?.currentUserId ||
    "";

  const filtered =
    useMemo(() => {
      if (
        !search.trim()
      ) {
        return workspaces;
      }

      const query =
        search.toLowerCase();

      return workspaces.filter(
        (
          workspace
        ) =>
          workspace.name
            ?.toLowerCase()
            .includes(
              query
            )
      );
    }, [
      workspaces,
      search,
    ]);

  const openCreate = () => {
    setMode("add");

    setEditingWorkspace(
      null
    );

    setShowModal(
      true
    );
  };

  const refreshWorkspaces =
    async () => {
      const fresh =
        await getWorkspaces();

      setWorkspaces(
        fresh || []
      );

      if (
        selectedId
      ) {
        try {
          const full =
            await getWorkspaceById(
              selectedId
            );

          setSelectedWorkspace(
            full
          );
        } catch {
          setSelectedWorkspace(
            null
          );
        }
      }
    };

  const handleSave = async (
    data: {
      name: string;
      description: string;

      members: {
        email: string;
        valid: boolean;
        name?: string;
      }[];
    }
  ) => {
    try {
      const payload = {
        name: data.name,

        description:
          data.description,

        members:
          data.members.map(
            (member) => ({
              email:
                member.email,
            })
          ),
      };

      if (
        mode === "add"
      ) {
        await createWorkspace(
          payload
        );
      } else if (
        editingWorkspace
      ) {
        await updateWorkspace(
          editingWorkspace.id,
          payload
        );
      }

      await refreshWorkspaces();

      setShowModal(
        false
      );
    } catch (error) {
      console.error(
        "Failed to save workspace",
        error
      );
    }
  };

  const handleDelete =
    async () => {
      if (
        !deleteTarget
      ) {
        return;
      }

      try {
        await deleteWorkspace(
          deleteTarget.id
        );

        if (
          selectedId ===
          deleteTarget.id
        ) {
          navigate(
            "/workspaces"
          );
        }

        await refreshWorkspaces();

        setDeleteTarget(
          null
        );
      } catch (error) {
        console.error(
          "Failed to delete workspace",
          error
        );
      }
    };

  return (
    <main className="flex h-screen w-full overflow-hidden">
      <aside className="w-[280px] shrink-0 border-r border-zinc-900 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between pt-1 pb-8 pr-4">
          <h1 className="text-xl font-bold text-white">
            Workspaces
          </h1>

          <button
            onClick={
              openCreate
            }
            className="text-white hover:text-gray-300 transition"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        <div className="pr-4 pb-4">
          <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-500" />

            <input
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
              placeholder="Search"
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500 text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
          <ul>
            {filtered.map(
              (
                workspace
              ) => {
                const isActive =
                  workspace.id ===
                  selectedId;

                const initial =
                  workspace.name
                    ?.charAt(
                      0
                    )
                    ?.toUpperCase() ||
                  "W";

                return (
                  <li
                    key={
                      workspace.id
                    }
                  >
                    <button
                      onClick={() =>
                        navigate(
                          `/workspaces/${workspace.id}`
                        )
                      }
                      className={`w-full flex items-center gap-3 py-2 text-left transition ${
                        isActive
                          ? "bg-gray-900/50"
                          : "hover:bg-gray-900/50"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-base font-semibold text-white shrink-0">
                        {
                          initial
                        }
                      </div>

                      <p className="text-sm font-semibold text-white truncate">
                        {
                          workspace.name
                        }
                      </p>
                    </button>
                  </li>
                );
              }
            )}
          </ul>
        </div>
      </aside>

      <section className="flex-1 h-full overflow-hidden min-w-0">
        {selectedWorkspace ? (
          <WorkspaceDetails
            workspace={
              selectedWorkspace
            }
            currentUserId={
              currentUserId
            }
            currentUserRole={
              currentUserRole
            }
            onBack={() =>
              navigate(
                "/workspaces"
              )
            }
            onUpdateWorkspace={async (
              data
            ) => {
              await updateWorkspace(
                selectedWorkspace.id,
                {
                  name: data.name,
                  description:
                    data.description,
                  members:
                    selectedWorkspace.members?.map(
                      (
                        member
                      ) => ({
                        email:
                          member.email,
                      })
                    ) || [],
                }
              );

              await refreshWorkspaces();
            }}
            onDeleteWorkspace={async () => {
              await deleteWorkspace(
                selectedWorkspace.id
              );

              navigate(
                "/workspaces"
              );

              await refreshWorkspaces();
            }}
            onAddTask={async (
              task: TaskCreateInput
            ) => {
              await addTask(
                selectedWorkspace.id,
                task
              );

              await refreshWorkspaces();
            }}
            onEditTask={async (
              taskId: string,
              task: TaskUpdateInput
            ) => {
              await updateTask(
                selectedWorkspace.id,
                taskId,
                task
              );

              await refreshWorkspaces();
            }}
            onDeleteTask={async (
              taskId: string
            ) => {
              await deleteTask(
                selectedWorkspace.id,
                taskId
              );

              await refreshWorkspaces();
            }}
            onAddMember={async (
              email: string,
              role: UserRole
            ) => {
              await addMember(
                selectedWorkspace.id,
                email,
                role
              );

              await refreshWorkspaces();
            }}
            onRemoveMember={async (
              memberId: string
            ) => {
              await removeMember(
                selectedWorkspace.id,
                memberId
              );

              await refreshWorkspaces();
            }}
            onUpdateMemberRole={async (
              memberId: string,
              role: UserRole
            ) => {
              await updateMemberRole(
                selectedWorkspace.id,
                memberId,
                role
              );

              await refreshWorkspaces();
            }}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-light text-white mb-2">
              Your workspaces
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Select or create a workspace to get started
            </p>

            <button
              onClick={
                openCreate
              }
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg text-sm font-semibold text-white transition"
            >
              <Plus className="w-4 h-4" />
              New Workspace
            </button>
          </div>
        )}
      </section>

      <WorkspaceModal
        isOpen={
          showModal
        }
        mode={mode}
        initialData={
          editingWorkspace
            ? {
                name:
                  editingWorkspace.name,
                description:
                  editingWorkspace.description ||
                  "",
                members: [],
              }
            : undefined
        }
        onClose={() =>
          setShowModal(
            false
          )
        }
        onSave={
          handleSave
        }
        checkUser={
          checkUser
        }
      />

      <DeleteWorkspaceModal
        isOpen={
          !!deleteTarget
        }
        workspaceName={
          deleteTarget?.name ||
          ""
        }
        onClose={() =>
          setDeleteTarget(
            null
          )
        }
        onConfirm={
          handleDelete
        }
      />
    </main>
  );
}