import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Play,
  Pause,
  Check,
  Edit2,
  Clock,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import type { Task } from "../../domain/entities/Task";

interface TaskCardProps {
  task: Task;
  highlightedTitle?: ReactNode; 
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
  highlightedTitle,
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
      className={`bg-[#1a2332] max-w-xl border rounded-2xl p-4 transition-all group ${
        isOverdue
          ? "border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.25)]"
          : "border-gray-700 hover:border-cyan-500/30"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm leading-tight">
            {highlightedTitle ?? task.title}
          </h3>
          {isOverdue && (
            <span className="text-xs text-red-700 font-medium inline-flex items-center">
              <TriangleAlert className="w-3.5 h-3.5  mr-1" />
              Overdue
            </span>
          )}
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {task.description || ""}
          </p>
        </div>

        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-white p-1"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-400 p-1"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Priority */}
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
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
        <span className="text-xs text-gray-400 flex items-center gap-0.5">
          <Clock className="w-3 h-3" />
          {formatDate(task.dueDate)}
        </span>

        {/* Recurring */}
        {task.type === "recurring" && task.days?.length ? (
          <div className="flex flex-wrap gap-0.5">
            {task.days.map((day) => (
              <span
                key={day}
                className="text-xs text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-medium"
              >
                {day.toUpperCase()}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* Timer & Controls */}
      <div className="flex items-center gap-2">
        {task.status === "in-progress" && (
          <div className="flex-1 bg-gray-900/70 rounded-xl px-2 py-1.5 font-mono text-cyan-400 text-xs text-center">
            {formatTime(liveTime)}
          </div>
        )}

        <div className="flex gap-1.5">
          {/* TODO → START */}
          {task.status === "todo" && onStart && (
            <button
              onClick={onStart}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all active:scale-95"
              title="Start"
            >
              <Play className="w-3.5 h-3.5 text-zinc-200" />
            </button>
          )}

          {/* IN PROGRESS */}
          {task.status === "in-progress" && (
            <>
              <button
                onClick={task.isTimerRunning ? onPause : onPlay}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all active:scale-95"
                title={task.isTimerRunning ? "Pause" : "Resume"}
              >
                {task.isTimerRunning ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
              </button>

              {onComplete && (
                <button
                  onClick={onComplete}
                  className="w-8 h-8 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg flex items-center justify-center transition-all active:scale-95"
                  title="Complete"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </>
          )}

          {/* COMPLETED */}
          {task.status === "completed" && (
            <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
