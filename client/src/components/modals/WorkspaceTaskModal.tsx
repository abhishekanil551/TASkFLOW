import React, { useState, useEffect } from "react";
import { X, AlertCircle, Plus, Trash2, Calendar } from "lucide-react";
import type { Task, TaskCreateInput, TaskUpdateInput, SubTaskCreateInput, WorkspaceMember } from "../../types/workspace";

interface Props {
  isOpen: boolean;
  mode: "add" | "edit";
  members: WorkspaceMember[];
  initialTask?: Task;
  onClose: () => void;
  onSave: (task: TaskCreateInput | TaskUpdateInput) => void;
}

export interface SubTaskUpdateInput {
  id?: string;
  title: string;
  attachments: string[];
  completed?: boolean;
}

export const TaskModal: React.FC<Props> = ({ isOpen, mode, members, initialTask, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<
    "todo" |
    "in-progress" |
    "submitted" |
    "reviewing" |
    "completed"
  >("todo"); const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [subTasks, setSubTasks] = useState<SubTaskUpdateInput[]>([]); const [newSubTaskTitle, setNewSubTaskTitle] = useState("");
  const [newAttachment, setNewAttachment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === "edit" && initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setAssignedTo(initialTask.assignedTo || []);
      setDueDate(initialTask.dueDate || "");
      setAttachments(initialTask.attachments || []);
      setSubTasks(
        initialTask.subTasks?.map(st => ({
          id: st.id,
          title: st.title,
          completed: st.completed,
          attachments: st.attachments || []
        })) || []
      );
    } else {
      resetForm();
    }
  }, [isOpen, mode, initialTask]);

  const resetForm = () => {
    setTitle(""); setDescription(""); setStatus("todo"); setPriority("medium");
    setAssignedTo([]); setDueDate(""); setAttachments([]); setSubTasks([]);
    setNewSubTaskTitle(""); setNewAttachment(""); setError(null);
  };

  const filteredMembers = members.filter((member) =>
    (member.name || member.email || "")
      .toLowerCase()
      .includes(memberSearch.toLowerCase())
  );

  const toggleMember = (userId: string) => {
    setAssignedTo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );

    if (error) {
      setError(null);
    }
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (assignedTo.length === 0) {
      setError("Please assign at least one member");
      return;
    }
    if (!dueDate) {
      setError("Due date is required");
      return;
    }
    setSaving(true);
    try {
      const taskData: TaskCreateInput | TaskUpdateInput = {
        title: title.trim(),
        description:
          description.trim() || undefined,

        status,

        priority,

        assignedTo,

        dueDate,

        attachments,

        subTasks: subTasks.map(
          (subTask) => ({
            title: subTask.title,
            attachments:
              subTask.attachments,
          })
        ),
      };
      await onSave(taskData);
      onClose();
    } catch {
      setError("Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const addSubTask = () => {
    const value =
      newSubTaskTitle.trim();

    if (!value) {
      return;
    }

    const exists =
      subTasks.some(
        (task) =>
          task.title.toLowerCase() ===
          value.toLowerCase()
      );

    if (exists) {
      setError(
        "Subtask already exists"
      );

      return;
    }

    setSubTasks([
      ...subTasks,
      {
        title: value,
        attachments: [],
      },
    ]);

    setNewSubTaskTitle("");
  };

  const removeSubTask = (index: number) => setSubTasks(subTasks.filter((_, i) => i !== index));

  const addAttachment = () => {
    const value =
      newAttachment.trim();

    if (!value) {
      return;
    }

    if (
      attachments.includes(
        value
      )
    ) {
      setError(
        "Attachment already added"
      );

      return;
    }

    try {
      new URL(value);

      setAttachments([
        ...attachments,
        value,
      ]);

      setNewAttachment("");
    } catch {
      setError(
        "Please enter a valid URL"
      );
    }
  };

  const removeAttachment = (index: number) => setAttachments(attachments.filter((_, i) => i !== index));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-[#0f1419] rounded-2xl w-full max-w-2xl p-8 border border-gray-600/30 shadow-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{mode === "add" ? "Create Task" : "Edit Task"}</h2>
          <button onClick={onClose}><X className="text-gray-400 hover:text-gray-200" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Title</label>
            <input value={title} onChange={(e) => {
              setTitle(e.target.value);

              if (error) {
                setError(null);
              }
            }} className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50" required />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50 min-h-[80px]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value as any)} className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">
              Assign Members *
            </label>

            <input
              type="text"
              value={memberSearch}
              onChange={(e) =>
                setMemberSearch(
                  e.target.value
                )
              }
              placeholder="Search members..."
              className="w-full p-3 mb-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20 focus:border-cyan-500/50"
            />

            {assignedTo.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {assignedTo.map((userId) => {
                  const member =
                    members.find(
                      (m) =>
                        (m.userId ||
                          m.id) === userId
                    );

                  if (!member)
                    return null;

                  return (
                    <div
                      key={userId}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30"
                    >
                      <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                        {(member.name ||
                          member.email)
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="text-sm text-white">
                        {member.name ||
                          member.email}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          toggleMember(
                            userId
                          )
                        }
                        className="text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="max-h-56 overflow-y-auto rounded-lg border border-gray-600/20 bg-[#1a1f2e]">
              {filteredMembers.length ===
                0 ? (
                <div className="p-4 text-sm text-gray-500">
                  No members found
                </div>
              ) : (
                filteredMembers.map(
                  (member) => {
                    const id =
                      member.userId ||
                      member.id;

                    const selected =
                      assignedTo.includes(
                        id
                      );

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          toggleMember(
                            id
                          )
                        }
                        className={`w-full flex items-center justify-between p-3 border-b border-gray-700 last:border-none transition ${selected
                          ? "bg-cyan-500/10"
                          : "hover:bg-white/5"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">
                            {(member.name ||
                              member.email)
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="text-left">
                            <div className="text-white text-sm font-medium">
                              {member.name ||
                                "Unknown"}
                            </div>

                            <div className="text-xs text-gray-400">
                              {
                                member.email
                              }
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${selected
                            ? "bg-cyan-500 border-cyan-500"
                            : "border-gray-500"
                            }`}
                        >
                          {selected &&
                            "✓"}
                        </div>
                      </button>
                    );
                  }
                )
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Due Date</label>
            <input type="date"
              min={
                new Date()
                  .toISOString()
                  .split("T")[0]
              } value={dueDate} onChange={(e) => {
                setDueDate(e.target.value);

                if (error) {
                  setError(null);
                }
              }} className="w-full p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20" />
          </div>

          {/* Attachments */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Attachments</label>
            <div className="flex gap-2 mb-2">
              <input value={newAttachment} onChange={e => setNewAttachment(e.target.value)} placeholder="Attachment URL" className="flex-1 p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20" />
              <button type="button" onClick={addAttachment} className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
            </div>
            {attachments.map((att, i) => (
              <div key={i} className="flex justify-between items-center p-2 bg-[#1a1f2e] rounded mb-1">
                <span className="text-sm truncate">{att}</span>
                <button type="button" onClick={() => removeAttachment(i)}><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
          </div>

          {/* Subtasks */}
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Subtasks</label>
            <div className="flex gap-2 mb-2">
              <input value={newSubTaskTitle} onChange={e => setNewSubTaskTitle(e.target.value)} placeholder="Subtask title" className="flex-1 p-3 bg-[#1a1f2e] text-white rounded-lg border border-gray-600/20" />
              <button type="button" onClick={addSubTask} className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"><Plus className="w-5 h-5" /></button>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {subTasks.length}
              {" "}
              subtasks added
            </p>
            {subTasks.map((st, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#1a1f2e] rounded mb-2">
                <span>{st.title}</span>
                <button type="button" onClick={() => removeSubTask(i)}><Trash2 className="w-4 h-4 text-red-400" /></button>
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{error}</p>}

          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-700/60 hover:bg-gray-600 p-3 rounded-lg text-white">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg text-white font-medium">{saving ? "Saving..." : mode === "add" ? "Create Task" : "Update Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};