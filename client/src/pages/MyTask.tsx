import { useState, useEffect } from "react";
import { Plus, Filter, LayoutGrid, List } from "lucide-react";

import TaskCard from "../components/common/TaskCard";
import AddTaskModal from "../components/modals/AddTaskModal";
import { useTask } from "../components/hooks/useTask";
import type { Task } from "../domain/entities/Task";

type FilterTab = "all" | "active" | "completed";

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ✅ API METHODS
  const { getTasks, toggleTimer, completeTask, addTask, updateTask } = useTask();

  // ✅ FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      }
    };

    fetchTasks();
  }, [getTasks]);

  // ✅ ACTIONS

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleTimer(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const updated = await completeTask(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Complete failed", err);
    }
  };

  const handleAdd = async (data: Task) => {
    try {
      const newTask = await addTask(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const handleUpdate = async (id: string, data: Task) => {
    try {
      const updated = await updateTask(id, data);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ✅ FILTER
  const filteredTasks = tasks.filter((task: Task) => {
    if (filterTab === "active") return task.status !== "completed";
    if (filterTab === "completed") return task.status === "completed";
    return true;
  });

  // ✅ STATS
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t: Task) => t.status === "completed").length,
    inProgress: tasks.filter((t: Task) => t.status === "in-progress").length,
    todo: tasks.filter((t: Task) => t.status === "todo").length,
  };



  return (
    <div className="">
      <main className="">
        <div className="">

          {/* HEADER */}
          <div className="flex justify-between items-start  mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
              <p className="text-sm text-gray-400">Tasks assigned to you</p>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex gap-4 text-right">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
                  <p className="text-xs text-gray-400">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
                  <p className="text-xs text-gray-400">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                  <p className="text-xs text-gray-400">Completed</p>
                </div>
              </div>

              <div className="flex gap-2 ml-6 border-l border-gray-700 pl-6">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all ${viewMode === "list" ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white"}`}
                >
                  <List className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowAddModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-all ml-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>

          {/* FILTER */}
          <div className="flex gap-4 mb-8 border-b border-gray-700 pb-4">
            {["all", "active", "completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab as FilterTab)}
                className={`text-sm font-medium capitalize transition-all ${
                  filterTab === tab
                    ? "text-white border-b-2 border-cyan-500 pb-1"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TASKS BY CATEGORY */}
          {filteredTasks.length > 0 ? (
            <div className="space-y-8">
              {/* TO DO */}
              {filteredTasks.filter((t) => t.status === "todo").length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    To Do
                    <span className="text-sm text-gray-400 ml-2">
                      {filteredTasks.filter((t) => t.status === "todo").length}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTasks
                      .filter((t) => t.status === "todo")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStart={() => handleToggle(task.id!)}
                          onPause={() => handleToggle(task.id!)}
                          onPlay={() => handleToggle(task.id!)}
                          onComplete={() => handleComplete(task.id!)}
                          onEdit={() => {
                            setEditingTask(task);
                            setShowAddModal(true);
                          }}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* IN PROGRESS */}
              {filteredTasks.filter((t) => t.status === "in-progress").length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    In Progress
                    <span className="text-sm text-gray-400 ml-2">
                      {filteredTasks.filter((t) => t.status === "in-progress").length}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTasks
                      .filter((t) => t.status === "in-progress")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStart={() => handleToggle(task.id!)}
                          onPause={() => handleToggle(task.id!)}
                          onPlay={() => handleToggle(task.id!)}
                          onComplete={() => handleComplete(task.id!)}
                          onEdit={() => {
                            setEditingTask(task);
                            setShowAddModal(true);
                          }}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">In Progress<span className="text-sm text-gray-400 ml-2">0</span></h2>
                  <EmptyState />
                </div>
              )}

              {/* COMPLETED */}
              {filteredTasks.filter((t) => t.status === "completed").length > 0 ? (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Completed
                    <span className="text-sm text-gray-400 ml-2">
                      {filteredTasks.filter((t) => t.status === "completed").length}
                    </span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTasks
                      .filter((t) => t.status === "completed")
                      .map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onStart={() => handleToggle(task.id!)}
                          onPause={() => handleToggle(task.id!)}
                          onPlay={() => handleToggle(task.id!)}
                          onComplete={() => handleComplete(task.id!)}
                          onEdit={() => {
                            setEditingTask(task);
                            setShowAddModal(true);
                          }}
                        />
                      ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4">Completed<span className="text-sm text-gray-400 ml-2">0</span></h2>
                  <EmptyState />
                </div>
              )}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>

      {/* MODAL */}
      <AddTaskModal
        key={editingTask?.id || "new"}
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTask(null);
        }}
        onSubmit={
          editingTask
            ? (data) => handleUpdate(editingTask.id!, data)
            : handleAdd
        }
        initialData={editingTask || undefined}
      />
    </div>
  );
}

