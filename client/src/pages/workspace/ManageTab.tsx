import { useState } from "react";
import { Settings, Trash2, Save, AlertTriangle } from "lucide-react";
import type { Workspace } from "../../types/workspace";

interface ManageTabProps {
  workspace: Workspace;
  onUpdateWorkspace: (
    data: {
      name: string;
    }
  ) => void; onDeleteWorkspace: () => void;
}

export function ManageTab({
  workspace,
  onUpdateWorkspace,
  onDeleteWorkspace,
}: ManageTabProps) {
  const [name, setName] = useState(workspace.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  const hasChanges =
    name !== workspace.name;


  const handleSave = async () => {
    try {
      setErrorMessage("");

      await Promise.resolve(
        onUpdateWorkspace({
          name: name.trim(),
        })
      );

      setSuccessMessage(
        "Workspace renamed successfully"
      );
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
        "Failed to rename workspace"
      );
    }
  };

  const handleDelete = () => {
    if (deleteConfirmText === workspace.name) {
      onDeleteWorkspace();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Manage Workspace
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Update workspace settings or delete it
        </p>
      </div>

      {/* Settings Form */}
      <div className="flex-1 overflow-y-auto flex justify-center items-center ">
        <div className="space-y-6 max-w-xl">
          {/* Workspace Info */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl mt-5 p-6">
            <h3 className="text-white font-medium mb-4">Workspace Details</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Workspace name"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!hasChanges || !name.trim()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${hasChanges && name.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                  }`}
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              {successMessage && (
                <p className="text-green-400 text-sm">
                  {successMessage}
                </p>
              )}

              {errorMessage && (
                <p className="text-red-400 text-sm">
                  {errorMessage}
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <h3 className="text-white font-medium mb-4">Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {workspace.members?.length || 0}
                </p>
                <p className="text-xs text-zinc-400 mt-1">Members</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-white">
                  {workspace.tasks?.length || 0}
                </p>
                <p className="text-xs text-zinc-400 mt-1">Tasks</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">
                  {workspace.tasks?.filter((t) => t.status === "completed")
                    .length || 0}
                </p>
                <p className="text-xs text-zinc-400 mt-1">Completed</p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-red-400 font-medium">Danger Zone</h3>
                <p className="text-zinc-400 text-sm mt-1 mb-4">
                  Once you delete a workspace, there is no going back. Please be
                  certain.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Workspace
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-300">
                      Type{" "}
                      <span className="font-mono text-red-400">
                        {workspace.name}
                      </span>{" "}
                      to confirm:
                    </p>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full bg-zinc-900 border border-red-500/50 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder={workspace.name}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText("");
                        }}
                        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleteConfirmText !== workspace.name}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${deleteConfirmText === workspace.name
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                          }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Forever
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}