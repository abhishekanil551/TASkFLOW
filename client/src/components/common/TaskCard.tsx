import { useEffect, useState } from "react";
import { Play, Pause, Check, Edit2, Clock, Trash2 } from "lucide-react";
import type { Task } from "../../domain/entities/Task";

interface TaskCardProps {
  task: Task;
  isOverdue?: boolean;
  onStart?: () => void;
  onPause?: () => void;
  onPlay?: () => void;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TaskCard({
  task,
  isOverdue,
  onStart,
  onPause,
  onPlay,
  onComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!task.isTimerRunning || task.status !== "in-progress") return;

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.isTimerRunning, task.status]);

  const baseTime = task.timeSpent ?? 0;
  const liveTime = baseTime + tick;

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "No date";
    return date;
  };

  return (
    <div
      className={`bg-[#1a2332] border ${
        isOverdue
          ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)] hover:shadow-red-500/40"
          : "border-gray-700 hover:border-cyan-500/30"
      } min-w-fit max-w-md rounded-3xl p-5 transition-all group`}
    >
      {" "}
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg leading-tight">
            {task.title}
          </h3>
          {isOverdue && (
            <span className="text-xs text-red-400 font-medium">⚠ Overdue</span>
          )}
          <p className="text-gray-400 text-sm mt-1 line-clamp-2">
            {task.description || ""}
          </p>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-white p-1"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-400 p-1"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Priority */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-2xl border ${
            task.priority === "low"
              ? "bg-blue-500/10 text-blue-400"
              : task.priority === "medium"
                ? "bg-yellow-500/10 text-yellow-400"
                : task.priority === "high"
                  ? "bg-orange-500/10 text-orange-400"
                  : "bg-red-950/90 text-red-200"
          }`}
        >
          {task.priority.toUpperCase()}
        </span>

        {/* Date */}
        <span className="text-sm text-gray-400 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(task.dueDate)}
        </span>

        {/* Recurring */}
        {task.type === "recurring" && task.days?.length ? (
          <div className="flex flex-wrap gap-0.5 mt-2">
            {task.days.map((day) => (
              <span
                key={day}
                className="text-xs text-cyan-400 bg-cyan-500/10 px-0.5 py-0.3 rounded border border-cyan-500/20"
              >
                {day.toUpperCase()}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {/* Timer */}
      <div className="flex items-center gap-3">
        {task.status === "in-progress" && (
          <div className="flex-1 bg-gray-900/70 rounded-2xl px-3 py-2 font-mono text-cyan-400 text-sm text-center">
            {formatTime(liveTime)}
          </div>
        )}

        <div className="flex gap-2">
          {/* TODO → START */}
          {task.status === "todo" && onStart && (
            <button
              onClick={onStart}
              className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all active:scale-95"
              title="Start Task"
            >
              <Play className="w-4 h-4 text-zinc-200" />
            </button>
          )}

          {/* IN PROGRESS */}
          {task.status === "in-progress" && (
            <>
              <button
                onClick={task.isTimerRunning ? onPause : onPlay}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center transition-all active:scale-95"
                title={task.isTimerRunning ? "Pause" : "Resume"}
              >
                {task.isTimerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              {onComplete && (
                <button
                  onClick={onComplete}
                  className="w-10 h-10 bg-green-500 hover:bg-green-600 text-black rounded-xl flex items-center justify-center transition-all active:scale-95"
                  title="Complete"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          {/* COMPLETED */}
          {task.status === "completed" && (
            <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
