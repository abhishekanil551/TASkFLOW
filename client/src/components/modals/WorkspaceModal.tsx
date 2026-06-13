import React, { useState, useEffect } from "react";
import {
  X,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";

interface Member {
  email: string;
  valid: boolean;
  name?: string;
}

interface Props {
  isOpen: boolean;
  mode: "add" | "edit";
  initialData?: {
    name: string;
    description: string;
    members: Member[];
  };
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    members: Member[];
  }) => void;

  // backend email validation
  checkUser: (email: string) => Promise<{ valid: boolean; name?: string }>;
}

export const WorkspaceModal: React.FC<Props> = ({
  isOpen,
  mode,
  initialData,
  onClose,
  onSave,
  checkUser,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );

  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<Member[]>(
    initialData?.members || []
  );
  const [saving, setSaving] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (!isOpen) return;

    setName(initialData?.name || "");
    setDescription(initialData?.description || "");
    setMembers(initialData?.members || []);
  }, [isOpen, initialData]);


  // ADD MEMBER (REAL VALIDATION)
  const handleAddMember = async () => {
    const email = memberEmail.trim();
    console.log("CLICKED ADD MEMBER");
    if (!email) return;

    if (members.some((m) => m.email.toLowerCase() === email.toLowerCase())) {
      setError("Member already added");
      return;
    }

    setLoadingEmail(true);

    try {
      const res = await checkUser(email);

      setMembers((prev) => [
        ...prev,
        {
          email,
          valid: res.valid,
          name: res.name,
        },
      ]);

      setMemberEmail("");
      setError(null);
    } catch {
      setError("Failed to validate user");
    } finally {
      setLoadingEmail(false);
    }
  };

  const removeMember = (email: string) => {
    setMembers((prev) => prev.filter((m) => m.email !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Workspace name required");
      return;
    }

    if (!description.trim()) {
      setError("Description required");
      return;
    }

    if (members.length === 0) {
      setError("Add at least one member");
      return;
    }

    if (members.some((m) => !m.valid)) {
      setError("Fix invalid members");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        members,
      });

      setName("");
      setDescription("");
      setMembers([]);
      setError(null);

      onClose();
    } catch {
      setError("Failed to save workspace");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const validCount = members.filter((m) => m.valid).length;
  const invalidCount = members.filter((m) => !m.valid).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#0f1419] rounded-2xl w-full max-w-2xl p-8 border border-gray-600/30 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === "add" ? "Create Workspace" : "Edit Workspace"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-400 hover:text-gray-200 transition-colors" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Workspace Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workspace name"
              className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50 focus:outline-none transition-all"
            />
          </div>

          {/* DESC */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50 focus:outline-none transition-all min-h-[80px]"
            />
          </div>

          {/* MEMBER INPUT */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">
              Add Members
            </label>
            <div className="flex gap-2">
              <input
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1 p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50 focus:outline-none transition-all"
              />

              <button
                type="button"
                onClick={handleAddMember}
                disabled={loadingEmail}
                className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                {loadingEmail ? "..." : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* MEMBERS LIST */}
          {members.length > 0 && (
            <div className="space-y-2">
              {members.map((m) => (
                <div
                  key={m.email}
                  className={`flex justify-between items-center p-3 rounded-lg border transition-all ${m.valid
                    ? "border-green-500/30 bg-green-500/10"
                    : "border-red-500/30 bg-red-500/10"
                    }`}
                >
                  <div>
                    <p className="text-sm text-white font-medium">{m.name || m.email}</p>
                    <p
                      className={`text-xs ${m.valid ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {m.valid ? "Valid user" : "User not found"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMember(m.email)}
                    className="p-2 hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STATS */}
          {members.length > 0 && (
            <div className="flex gap-4 text-sm">
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {validCount} valid
              </span>

              {invalidCount > 0 && (
                <span className="text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {invalidCount} invalid
                </span>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700/60 hover:bg-gray-600 p-3 rounded-lg text-white font-medium transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg text-white font-medium"
            >
              {saving ? "Saving..." : mode === "add" ? "Create" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};