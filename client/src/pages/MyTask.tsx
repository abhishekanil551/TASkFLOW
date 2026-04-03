import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Plus, Search } from "lucide-react";

import TaskCard from "../components/common/TaskCard";
import AddTaskModal from "../components/modals/AddTaskModal";
import Pagination from "../components/common/Pagination";

import { useTask } from "../components/hooks/useTask";
import type { Task } from "../domain/entities/Task";

type FilterTab = "all" | "active" | "completed" | "overdue";

export default function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { getAllTasks, toggleTimer, completeTask, addTask, updateTask } =
    useTask();

  // ✅ debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // ✅ FETCH
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getAllTasks(page, 10, {
          search: debouncedSearch,
          status: filterTab,
          priority: priorityFilter,
        });

        setTasks(res.data);
        setTotalPages(res.totalPages);
        setTotalItems(res.total);
      } catch (err: unknown) {
        console.error(err);
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [page, debouncedSearch, filterTab, priorityFilter]);

  // ACTIONS
  const handleToggle = async (id: string) => {
    const updated = await toggleTimer(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleComplete = async (id: string) => {
    const updated = await completeTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const handleAdd = async (data: Task) => {
    const newTask = await addTask(data);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdate = async (id: string, data: Task) => {
    const updated = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // ✅ highlight
  const highlightText = (text: string): ReactNode => {
    if (!debouncedSearch) return text;

    const parts = text.split(new RegExp(`(${debouncedSearch})`, "gi"));

    return parts.map((part, i) =>
      part.toLowerCase() === debouncedSearch.toLowerCase() ? (
        <span key={i} className="bg-yellow-500/30 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div>
      <main className="p-3">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">My Tasks</h1>
            <p className="text-xs text-gray-400">
              Manage and track your tasks
            </p>
          </div>

          {/* STATS */}
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <p className="text-blue-400 font-bold">{totalItems}</p>
              <p className="text-gray-400 text-xs">Total</p>
            </div>

            <div className="text-center">
              <p className="text-yellow-400 font-bold">
                {tasks.filter((t) => t.status === "in-progress").length}
              </p>
              <p className="text-gray-400 text-xs">In Progress</p>
            </div>

            <div className="text-center">
              <p className="text-green-400 font-bold">
                {tasks.filter((t) => t.status === "completed").length}
              </p>
              <p className="text-gray-400 text-xs">Completed</p>
            </div>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => {
              setEditingTask(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-lg text-white text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="pl-9 pr-3 py-2 bg-gray-900 text-white rounded-lg w-full"
            />
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-900 text-white px-3 py-2 rounded-lg"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-5">
          {["all", "active", "completed", "overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilterTab(tab as FilterTab);
                setPage(1);
              }}
              className={filterTab === tab ? "text-cyan-400" : "text-gray-400"}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-800 rounded animate-pulse"
              />
            ))}

          {!loading && error && (
            <div className="col-span-full text-center text-red-400">
              {error}
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="col-span-full text-center text-gray-400">
              No tasks found
            </div>
          )}

          {!loading &&
            !error &&
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                highlightedTitle={highlightText(task.title)}
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

        {/* PAGINATION */}
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, totalPages)}
          totalItems={totalItems}
          itemsPerPage={10}
          onPageChange={(p) => setPage(p)}
        />
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