
import { useState, useMemo } from "react";
import {
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Users,
  TrendingUp,
} from "lucide-react";
import type { Task, WorkspaceMember, MemberTaskAnalytics } from "@/types/workspace";

interface AnalyticsTabProps {
  tasks: Task[];
  members: WorkspaceMember[];
}

export function AnalyticsTab({ tasks, members }: AnalyticsTabProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Calculate overall analytics
  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const inProgress = tasks.filter((t) => t.status === "in-progress").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, pending, completionRate };
  }, [tasks]);

  // Calculate per-member analytics for selected task
  const taskMemberAnalytics = useMemo(() => {
    if (!selectedTask) return [];

    return selectedTask.assignedTo.map((memberId) => {
      const member = members.find((m) => m.id === memberId);
      const isCompleted = selectedTask.status === "completed";

      return {
        memberId,
        memberName: member?.name || "Unknown",
        memberEmail: member?.email || "",
        status: selectedTask.status,
        isCompleted,
      };
    });
  }, [selectedTask, members]);

  // Calculate overall member performance
  const memberPerformance = useMemo((): MemberTaskAnalytics[] => {
    return members.map((member) => {
      const assignedTasks = tasks.filter((t) =>
        t.assignedTo.includes(member.id)
      );
      const completed = assignedTasks.filter(
        (t) => t.status === "completed"
      ).length;
      const inProgress = assignedTasks.filter(
        (t) => t.status === "in-progress"
      ).length;
      const pending = assignedTasks.filter(
        (t) => t.status === "pending"
      ).length;
      const totalAssigned = assignedTasks.length;
      const completionRate =
        totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

      return {
        memberId: member.id,
        memberName: member.name,
        memberEmail: member.email,
        totalAssigned,
        completed,
        inProgress,
        pending,
        completionRate,
      };
    });
  }, [members, tasks]);

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "text-emerald-400";
      case "in-progress":
        return "text-amber-400";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusBg = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/20 border-emerald-500/30";
      case "in-progress":
        return "bg-amber-500/20 border-amber-500/30";
      default:
        return "bg-zinc-500/20 border-zinc-500/30";
    }
  };

  // Task detail view
  if (selectedTask) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedTask(null)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tasks
          </button>
          <h2 className="text-xl font-semibold text-white">{selectedTask.title}</h2>
          <p className="text-sm text-zinc-400 mt-1">{selectedTask.description}</p>
        </div>

        {/* Task Status */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedTask.status === "completed" && (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
              {selectedTask.status === "in-progress" && (
                <Clock className="w-5 h-5 text-amber-400" />
              )}
              {selectedTask.status === "pending" && (
                <AlertCircle className="w-5 h-5 text-zinc-400" />
              )}
              <span className={`font-medium ${getStatusColor(selectedTask.status)}`}>
                {selectedTask.status === "completed"
                  ? "Completed"
                  : selectedTask.status === "in-progress"
                    ? "In Progress"
                    : "Pending"}
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-full border text-sm ${getStatusBg(selectedTask.status)}`}
            >
              {selectedTask.priority} priority
            </span>
          </div>
        </div>

        {/* Member Performance for this Task */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Assigned Members ({taskMemberAnalytics.length})
          </h3>

          {taskMemberAnalytics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-500">No members assigned to this task</p>
            </div>
          ) : (
            <div className="space-y-3">
              {taskMemberAnalytics.map((analytics) => (
                <div
                  key={analytics.memberId}
                  className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    analytics.isCompleted
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-zinc-800/50 border-zinc-700/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                        analytics.isCompleted
                          ? "bg-emerald-500/30 text-emerald-400"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      {analytics.memberName?.charAt(0) ||
                        analytics.memberEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {analytics.memberName}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        {analytics.memberEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {analytics.isCompleted ? (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Done
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main analytics view
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          Track task completion and member performance
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Total Tasks</p>
          <p className="text-2xl font-bold text-white mt-1">
            {overallStats.total}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <p className="text-emerald-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {overallStats.completed}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <p className="text-amber-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {overallStats.inProgress}
          </p>
        </div>
        <div className="bg-zinc-500/10 border border-zinc-500/30 rounded-xl p-4">
          <p className="text-zinc-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-zinc-300 mt-1">
            {overallStats.pending}
          </p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-400 text-sm">Overall Completion Rate</span>
          <span className="text-white font-bold">{overallStats.completionRate}%</span>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${overallStats.completionRate}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Task List for Analysis */}
        <div>
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Click a task to analyze member performance
          </h3>

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              No tasks to analyze
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition hover:bg-zinc-800/80 ${getStatusBg(task.status)}`}
                >
                  <div className="flex items-center gap-3">
                    {task.status === "completed" && (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                    {task.status === "in-progress" && (
                      <Clock className="w-5 h-5 text-amber-400" />
                    )}
                    {task.status === "pending" && (
                      <AlertCircle className="w-5 h-5 text-zinc-400" />
                    )}
                    <div className="text-left">
                      <p className="text-white font-medium">{task.title}</p>
                      <p className="text-zinc-400 text-sm">
                        {task.assignedTo.length} member
                        {task.assignedTo.length !== 1 ? "s" : ""} assigned
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Member Performance Overview */}
        <div>
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Member Performance Overview
          </h3>

          <div className="space-y-3">
            {memberPerformance.map((member) => (
              <div
                key={member.memberId}
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        member.completionRate >= 70
                          ? "bg-emerald-500/30 text-emerald-400"
                          : member.completionRate >= 40
                            ? "bg-amber-500/30 text-amber-400"
                            : "bg-zinc-700 text-white"
                      }`}
                    >
                      {member.memberName?.charAt(0) ||
                        member.memberEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        {member.memberName}
                      </p>
                      <p className="text-zinc-500 text-xs">
                        {member.totalAssigned} task
                        {member.totalAssigned !== 1 ? "s" : ""} assigned
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-bold ${
                      member.completionRate >= 70
                        ? "text-emerald-400"
                        : member.completionRate >= 40
                          ? "text-amber-400"
                          : "text-zinc-400"
                    }`}
                  >
                    {member.completionRate}%
                  </span>
                </div>

                <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      member.completionRate >= 70
                        ? "bg-emerald-500"
                        : member.completionRate >= 40
                          ? "bg-amber-500"
                          : "bg-zinc-500"
                    }`}
                    style={{ width: `${member.completionRate}%` }}
                  />
                </div>

                <div className="flex gap-4 mt-3 text-xs">
                  <span className="text-emerald-400">
                    {member.completed} done
                  </span>
                  <span className="text-amber-400">
                    {member.inProgress} in progress
                  </span>
                  <span className="text-zinc-400">{member.pending} pending</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}