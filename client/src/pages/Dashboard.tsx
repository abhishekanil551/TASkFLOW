import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../context/useAuthContext";
import MainLayout from "../components/layout/MainLayout";
import TaskCard from "../components/common/TaskCard";
import AddTaskModal from "../components/modals/AddTaskModal";
import { Plus } from "lucide-react";
import { useTask } from "../components/hooks/useTask";
import type { Task } from "../domain/entities/Task";

export default function Dashboard() {
  const { user } = useAuthContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const {
    getTasks,
    updateTask,
    addTask,
    toggleTimer,
    completeTask,
    deleteTask,
  } = useTask();

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ TODAY
  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  // ✅ SHOW ONLY TODAY TASKS (RECURRING + ONE-TIME)
  const isTaskForToday = (task: Task) => {
    if (task.type === "recurring") {
      return (task.days ?? []).includes(today);
    }
    return true;
  };

  // ✅ FETCH
  const fetchTasks = useCallback(async () => {
    try {
      const data = await getTasks();

      const normalized: Task[] = data.map((t: Task) => ({
        ...t,
        description: t.description || "",
        dueDate: t.dueDate || undefined,
        startDate: t.startDate || undefined,
        days: t.days || [],
      }));

      setTasks(normalized);
    } catch {
      console.error("Failed to fetch tasks");
    }
  }, [getTasks, today]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const addNewTask = async (newTask: Task) => {
    const tempTask: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || "",
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined,
      startDate: newTask.startDate || undefined,
      type: newTask.type,
      days: newTask.days || [],
      status: "todo",
      timeSpent: 0,
      isTimerRunning: false,
    };

    setTasks((prev) => [tempTask, ...prev]);

    try {
      const saved = await addTask(newTask);
      setTasks((prev) => prev.map((t) => (t.id === tempTask.id ? saved : t)));

      showToast("Task added ✅");
    } catch (err) {
      console.error("❌ Add failed", err);
      setTasks((prev) => prev.filter((t) => t.id !== tempTask.id));

      showToast("Failed to add task ❌");
    }
  };

  const handleStartTask = async (id: string) => {
    if (loadingIds.includes(id)) return;

    setLoadingIds((prev) => [...prev, id]);

    try {
      const updated = await toggleTimer(id);

      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      console.error("❌ Start task failed:", err);
      showToast("Start failed ❌");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handlePause = async (id: string) => {
    if (loadingIds.includes(id)) return;

    setLoadingIds((prev) => [...prev, id]);

    try {
      const updated = await toggleTimer(id);

      setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)));
    } catch (err) {
      console.error("❌ Pause task failed:", err);
      showToast("Pause failed ❌");
    } finally {
      setLoadingIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleCompleteTask = async (id: string) => {
    const prevTasks = [...tasks];

    try {
      const updated = await completeTask(id);

      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));

      showToast("Task completed ✅");
    } catch (err) {
      console.error("❌ Complete failed", err);
      setTasks(prevTasks);

      showToast("Complete failed ❌");
    }
  };

  const handleUpdateTask = async (updatedData: Task) => {
    if (!editingTask || !editingTask.id) return;

    const prevTasks = [...tasks];

    const updatedTask = { ...editingTask, ...updatedData };

    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? updatedTask : t)),
    );

    try {
      const saved = await updateTask(editingTask.id, updatedData);

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? saved : t)),
      );

      showToast("Task updated ✏️");
    } catch (err) {
      console.error("❌ Update failed", err);
      setTasks(prevTasks);

      showToast("Update failed ❌");
    }
  };

  const handleDeleteTask = async (id: string) => {
    const prevTasks = [...tasks];

    // ✅ optimistic UI
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
      showToast("Task deleted 🗑️");
    } catch (err) {
      console.error("❌ Delete failed:", err);

      // 🔥 rollback
      setTasks(prevTasks);

      showToast("Delete failed ❌");
    }
  };

  const isOverdue = (task: Task): boolean => {
    if (!task.dueDate) return false;

    return (
      task.status !== "completed" &&
      new Date(task.dueDate).getTime() < Date.now()
    );
  };

  const sortTasks = (list: Task[]) => {
    return [...list].sort((a, b) => {
      const now = new Date();

      const aOverdue =
        a.dueDate && a.status !== "completed" && new Date(a.dueDate) < now;

      const bOverdue =
        b.dueDate && b.status !== "completed" && new Date(b.dueDate) < now;

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;

      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }

      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      return 0;
    });
  };

  const visibleTasks = tasks.filter((task) => {
    if (!isTaskForToday(task)) return false;

    // ❌ hide completed overdue tasks
    if (
      task.status === "completed" &&
      task.dueDate &&
      new Date(task.dueDate) < new Date()
    ) {
      return false;
    }

    return true;
  });

  const todoTasks = sortTasks(visibleTasks.filter((t) => t.status === "todo"));
  const inProgressTasks = sortTasks(
    visibleTasks.filter((t) => t.status === "in-progress"),
  );
  const completedTasks = visibleTasks.filter((t) => t.status === "completed");

  return (
    <MainLayout>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">
          Welcome back, {user?.email?.split("@")[0]}
        </h1>
        <p className="text-sm text-gray-400">Focus on what matters today</p>
      </div>

      {/* ADD BUTTON */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TODO */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            To Do
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-md">
              {todoTasks.length}
            </span>
          </h2>

          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={isOverdue(task)}
                onStart={() => handleStartTask(task.id!)}
                onPause={() => handlePause(task.id!)}
                onPlay={() => handlePause(task.id!)}
                onComplete={() => handleCompleteTask(task.id!)}
                onDelete={() => handleDeleteTask(task.id!)}
                onEdit={() => {
                  setEditingTask(task);
                  setShowAddModal(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* IN PROGRESS */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            In Progress
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md font-medium">
              {inProgressTasks.length}
            </span>
          </h2>

          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={isOverdue(task)}
                onPause={() => handlePause(task.id!)}
                onPlay={() => handlePause(task.id!)}
                onDelete={() => handleDeleteTask(task.id!)}
                onComplete={() => handleCompleteTask(task.id!)}
                onEdit={() => {
                  setEditingTask(task);
                  setShowAddModal(true);
                }}
              />
            ))}
          </div>
        </div>

        {/* COMPLETED */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            Completed
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-md font-medium">
              {completedTasks.length}
            </span>
          </h2>

          <div className="space-y-3">
            {completedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => handleDeleteTask(task.id!)}
                onEdit={() => {
                  setEditingTask(task);
                  setShowAddModal(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="text-center text-gray-400 text-sm mt-10">
          No tasks yet. Start by adding one
        </div>
      )}

      {/* MODAL */}
      <AddTaskModal
        key={editingTask?.id || "new"}
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleUpdateTask : addNewTask}
        initialData={editingTask || undefined}
      />
      {toast && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg text-sm shadow-lg border border-gray-700">
          {toast}
        </div>
      )}
    </MainLayout>
  );
}