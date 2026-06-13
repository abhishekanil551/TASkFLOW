import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Activity as ActivityIcon,
  Download,
} from "lucide-react";
import { useState } from "react";
import type {
  Task,
  WorkspaceMember,
} from "../../types/workspace";
import TaskActionModal from "../../components/modals/TaskActionModal";

interface Props {
  task: Task;
  members: WorkspaceMember[];
  isAdmin: boolean;
  currentUserId: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;

  onStatusChange: (
    status:
      | "todo"
      | "in-progress"
      | "submitted"
      | "reviewing"
      | "completed",
    extraData?: any
  ) => Promise<void>;

  onSubTaskToggle: (
    subTaskId: string,
    completed: boolean
  ) => Promise<void>;
}

export default function TaskDetailsPage({
  task,
  members,
  isAdmin,
  currentUserId,
  onBack,
  onStatusChange,
  onSubTaskToggle,
}: Props) {
  const [activeTab, setActiveTab] = useState<
    "subtasks" | "activities"
  >("subtasks");

  const [modalMode, setModalMode] =
    useState<
      "submit" |
      "reject" |
      null
    >(null);


  const assignedMembers = members.filter(
    (member) =>
      task.assignedTo.includes(
        member.userId || member.id
      )
  );

  const isAssigned =
    task.assignedTo.includes(currentUserId);

  const getStatusColor = (
    status: string
  ): string => {
    switch (status) {
      case "completed":
        return "text-green-400";

      case "reviewing":
        return "text-orange-400";

      case "submitted":
        return "text-yellow-400";

      case "in-progress":
        return "text-blue-400";

      default:
        return "text-zinc-300";
    }
  };

  const getPriorityColor = (
    priority: string
  ): string => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const allSubTasksCompleted =
    task.subTasks.length === 0
      ? true
      : task.subTasks.every(
        (subTask) =>
          subTask.completed
      );


  const handleSubmitWork = async (data: {
    submissionProofs?: {
      link: string;
      description: string;
    }[];
  }) => {
    if (
      !data.submissionProofs ||
      data.submissionProofs.length === 0
    ) {
      alert(
        "At least one work link is required"
      );
      return;
    }

    await onStatusChange(
      "submitted",
      {
        submissionAttachments:
          data.submissionProofs.map(
            (proof) => proof.link
          ),

        submissionProofs:
          data.submissionProofs,
      }
    );

    setModalMode(null);
  };






  const handleRejectWork = async (data: {
    rejectReason?: string;
  }) => {
    if (!data.rejectReason?.trim()) {
      alert("Reason required");
      return;
    }

    await onStatusChange(
      "todo",
      {
        reviewComment:
          data.rejectReason,
      }
    );

    setModalMode(null);
  };


  return (
    <div className="min-h-screen mb-6  scrollbar-hide">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">
            Back to Tasks
          </span>
        </button>

        {task.isOverdue && (
          <div className="mb-6 rounded-xl border border-red-500 bg-red-500/10 p-4 animate-pulse">
            <h3 className="text-red-400 font-semibold">
              ⚠ Task Overdue
            </h3>

            <p
              className={`font-semibold ${task.isOverdue
                ? "text-red-500"
                : "text-zinc-400"
                }`}
            >
              {task.dueDate}
            </p>
          </div>
        )}


        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="col-span-2 space-y-6">
            {/* Title Section */}
            <div className=" rounded-2xl border border-gray-900 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-zinc-200 mb-4">
                    {task.title}
                  </h1>

                  <div className="flex gap-2 flex-wrap">
                    <span
                      className={`px-3 py-1 border border-gray-900 rounded-full text-xs font-medium ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status
                        ?.replace("-", " ")
                        .replace(/\b\w/g, (l) =>
                          l.toUpperCase()
                        )}
                    </span>
                    {task.priority && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Status */}
              <div className=" rounded-xl border border-gray-900 p-4">
                <div className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium">
                    Status
                  </span>
                </div>
                <p className="text-zinc-500">
                  {task.status
                    ?.replace("-", " ")
                    .replace(/\b\w/g, (l) =>
                      l.toUpperCase()
                    )}
                </p>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <div className=" rounded-xl border border-gray-900 p-4">
                  <div className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      Due date
                    </span>
                  </div>
                  <p className="text-zinc-400 font-semibold">
                    {task.dueDate}
                  </p>
                </div>
              )}

              {/* Assignees */}
              <div className=" rounded-xl border border-gray-900 p-4">
                <div className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                  <span className="font-medium">
                    Assignee
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {assignedMembers.length > 0 ? (
                    assignedMembers.map(
                      (member) => (
                        <span
                          key={member.id}
                          className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-800 text-zinc-500 text-sm"
                        >
                          {member.name ||
                            member.email}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              {/* Priority */}
              {task.priority && (
                <div className=" rounded-xl border border-gray-900 p-4">
                  <div className="flex items-center gap-2 text-zinc-300 text-sm mb-2">
                    <span className="font-medium">
                      Priority
                    </span>
                  </div>
                  <p className="text-zinc-500 font-semibold">
                    {task.priority}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-gray-900 p-6">
              <h2 className="text-lg font-semibold text-zinc-300 mb-3">
                Description
              </h2>
              <p className="text-zinc-500 leading-relaxed">
                {task.description ||
                  "No description provided"}
              </p>
            </div>

            {/* Attachments */}
            {task.attachments &&
              task.attachments.length > 0 && (
                <div className=" rounded-2xl border border-gray-900 p-6">
                  <h2 className="text-lg font-semibold text-zinc-300 mb-4">
                    Attachments
                  </h2>
                  <div className="space-y-2">
                    {task.attachments.map(
                      (file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg  hover:text-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {file
                              .split("/")
                              .pop()}
                          </span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Submission Section */}
            {task.submissionAttachments &&
              task.submissionAttachments
                .length > 0 && (
                <div className=" rounded-2xl border border-gray-900 p-6">
                  <h2 className="text-lg font-semibold text-zinc-300 mb-4">
                    Submitted Files
                  </h2>
                  <div className="space-y-2">
                    {task.submissionAttachments.map(
                      (file, index) => (
                        <a
                          key={index}
                          href={file}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-3 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {file}
                          </span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Review Comment */}
            {task.reviewComment && (
              <div className=" rounded-2xl border border-gray-900 p-6">
                <h2 className="text-lg font-semibold text-zinc-300 mb-3">
                  Review Comment
                </h2>
                <p className="text-zinc-500 leading-relaxed">
                  {task.reviewComment}
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Subtasks / Activities Tabs */}
            <div className=" rounded-2xl border border-gray-900 overflow-hidden">
              {/* Tab Navigation */}
              <div className="border-b border-gray-800">
                <div className="flex">
                  <button
                    onClick={() =>
                      setActiveTab("subtasks")
                    }
                    className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "subtasks"
                      ? "border-blue-900 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-700"
                      }`}
                  >
                    Subtasks
                  </button>
    
                  <button
                    onClick={() =>
                      setActiveTab("activities")
                    }
                    className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "activities"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-700"
                      }`}
                  >
                    Activities
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "subtasks" && (
                  <div className="space-y-3">
                    {task.subTasks &&
                      task.subTasks.length >
                      0 ? (
                      task.subTasks.map(
                        (subtask, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-900/50"
                          >
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={(e) =>
                                onSubTaskToggle(
                                  subtask.id,
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded mt-0.5"
                            />
                            <span className="text-sm text-gray-500">
                              {subtask.title}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-gray-500">
                        No subtasks
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "activities" && (
                  <div className="space-y-6 sticky top-0 self-start">
                    {task.timeline?.length ? (
                      task.timeline.map((item, index) => {
                        const isCurrentUser =
                          item.userId === currentUserId;

                        return (
                          <div
                            key={item.id || index}
                            className={`flex ${isCurrentUser
                                ? "justify-end"
                                : "justify-start"
                              }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-2xl p-4 ${item.type === "submission"
                                  ? "bg-blue-600/20 border border-blue-500/30"
                                  : item.type === "approval"
                                    ? "bg-green-600/20 border border-green-500/30"
                                    : item.type === "rejection"
                                      ? "bg-red-600/20 border border-red-500/30"
                                      : "bg-zinc-800 border border-zinc-700"
                                }`}
                            >
                              <div className="flex items-center justify-between gap-3 mb-2">
                                <span className="font-semibold text-sm capitalize">
                                  {item.type}
                                </span>

                                <span className="text-xs text-zinc-400">
                                  {new Date(
                                    item.createdAt
                                  ).toLocaleString()}
                                </span>
                              </div>

                              {item.message && (
                                <p className="text-sm text-zinc-200 whitespace-pre-wrap">
                                  {item.message}
                                </p>
                              )}

                              {item.link && (
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block mt-3 text-blue-400 break-all"
                                >
                                  {item.link}
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-zinc-500 py-10">
                        No activity yet
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className=" rounded-2xl p-4 space-y-2">
              {isAssigned &&
                task.status === "todo" && (
                  <button
                    onClick={() =>
                      onStatusChange("in-progress")
                    }
                    className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Task
                  </button>
                )}

              {isAssigned &&
                task.status ===
                "in-progress" && (
                  <button
                    disabled={
                      !allSubTasksCompleted
                    }
                    onClick={() =>
                      setModalMode("submit")
                    }
                    className={`w-full px-4 py-2 rounded-lg text-white font-medium ${allSubTasksCompleted
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-zinc-700 cursor-not-allowed"
                      }`}
                  >
                    {allSubTasksCompleted
                      ? "Submit Work"
                      : "Complete All Subtasks First"}
                  </button>
                )}

              {isAdmin &&
                task.status === "submitted" && (
                  <button
                    onClick={() =>
                      onStatusChange("reviewing")
                    }
                    className="w-full px-4 py-2 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors"
                  >
                    Start Review
                  </button>
                )}



              {isAdmin &&
                task.status === "reviewing" && (
                  <>
                    <button
                      onClick={() =>
                        onStatusChange("completed")
                      }
                      className="w-full px-4 py-2 rounded-lg bg-green-600 text-white"
                    >
                      Approve Task
                    </button>

                    <button
                      onClick={() =>
                        setModalMode("reject")
                      }
                      className="w-full px-4 py-2 rounded-lg bg-red-600 text-white"
                    >
                      Reject Task
                    </button>
                  </>
                )}

              <TaskActionModal
                isOpen={modalMode !== null}
                mode={
                  modalMode === "reject"
                    ? "reject"
                    : "submit"
                }
                onClose={() =>
                  setModalMode(null)
                }
                onSubmit={async (data) => {
                  if (
                    modalMode ===
                    "submit"
                  ) {
                    await handleSubmitWork(
                      data as {
                        submissionProofs: {
                          link: string;
                          description: string;
                        }[];
                      }
                    );
                  }

                  if (
                    modalMode ===
                    "reject"
                  ) {
                    await handleRejectWork(
                      data as {
                        rejectReason?: string;
                      }
                    );
                  }
                }}
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}