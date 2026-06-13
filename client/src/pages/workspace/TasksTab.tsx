import React, {
  useState,
  useMemo,
  useEffect,
} from "react"; import {
  ChevronRight,
  Plus,
  Pencil,
  Trash2,

} from "lucide-react";

import TaskDetailsPage from "../../pages/workspace/TaskDetailsPage";
import type { Workspace, Task, TaskCreateInput, TaskUpdateInput } from "../../types/workspace";
import { TaskModal } from "../../components/modals/WorkspaceTaskModal";
import { useWorkspace } from "../../hooks/useWorkspace";

interface Props {
  workspace?: Workspace;
  onAddTask: (task: TaskCreateInput) => Promise<void>;
  onEditTask: (taskId: string, task: TaskUpdateInput) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}


export const TasksTab: React.FC<Props> = ({
  workspace,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { updateSubTask } = useWorkspace();
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  useEffect(() => {
    setSelectedTask(null);
    setEditTask(null);
  }, [workspace?.id]);


  if (!workspace) {
    return <div className="p-6 text-center text-zinc-400">Loading tasks...</div>;
  }

  const isAdmin = workspace.currentUserRole === "admin";
  const currentUserId = workspace.currentUserId || "";
  const members = workspace.members || [];
  const allTasks = workspace.tasks || [];
  const [filter, setFilter] = useState<
    | "all"
    | "pending"
    | "completed"
    | "overdue"
    | "submitted"
    | "reviewing"
  >("pending");
  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const tasks = useMemo(() => {
    let filtered =
      isAdmin
        ? allTasks
        : allTasks.filter(
          (task) =>
            task.assignedTo.includes(
              currentUserId
            )
        );

    if (filter === "completed") {
      filtered = filtered.filter(
        (task) =>
          task.status ===
          "completed"
      );
    }

    if (filter === "overdue") {
      filtered = filtered.filter(
        (task) =>
          task.isOverdue
      );
    }

    if (filter === "pending") {
      filtered = filtered.filter(
        (task) =>
          task.status !==
          "completed"
      );
    }

    if (fromDate) {
      filtered = filtered.filter(
        (task) =>
          new Date(
            task.createdAt
          ) >=
          new Date(fromDate)
      );
    }

    if (toDate) {
      const endDate =
        new Date(toDate);

      endDate.setHours(
        23,
        59,
        59,
        999
      );

      filtered = filtered.filter(
        (task) =>
          new Date(
            task.createdAt
          ) <= endDate
      );
    }

    return filtered;
  }, [
    filter,
    fromDate,
    toDate,
    isAdmin,
    allTasks,
    currentUserId,
  ]);


  const handleCreate = async (
    task: TaskCreateInput | Partial<TaskCreateInput>
  ) => {
    if (!task.title || !task.status || !task.priority) return;
    await onAddTask(task as TaskCreateInput);
    setShowModal(false);
  };

  const handleUpdate = async (
    taskData: TaskCreateInput | Partial<TaskCreateInput>
  ) => {
    if (!editTask) return;
    await onEditTask(editTask.id, taskData as TaskUpdateInput);
    setEditTask(null);
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await onDeleteTask(taskId);
  };


  const handleStatusChange = async (
    status:
      | "todo"
      | "in-progress"
      | "submitted"
      | "reviewing"
      | "completed",
    extraData: any = {}
  ) => {
    if (!selectedTask) {
      return;
    }

    await onEditTask(
      selectedTask.id,
      {
        status,
        ...extraData,
      }
    );

    const updatedTask = {
      ...selectedTask,
      status,
      ...extraData,
    };

    setSelectedTask(
      updatedTask
    );

    setEditTask(null);
  };


  const handleSubTaskToggle = async (
    subTaskId: string,
    completed: boolean
  ) => {
    if (!workspace) {
      return;
    }

    try {
      await updateSubTask(
        workspace.id,
        selectedTask!.id,
        subTaskId,
        completed
      );

      const updatedSubTasks =
        selectedTask!.subTasks.map(
          (subTask) =>
            subTask.id === subTaskId
              ? {
                ...subTask,
                completed,
              }
              : subTask
        );

      setSelectedTask({
        ...selectedTask!,
        subTasks:
          updatedSubTasks,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (
    selectedTask &&
    workspace?.tasks?.some(
      (task) => task.id === selectedTask.id
    )
  ) {
    return (
      <TaskDetailsPage
        task={selectedTask}
        members={members}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
        onBack={() => setSelectedTask(null)}
        onEdit={() => setEditTask(selectedTask)}
        onDelete={() => handleDelete(selectedTask.id)}
        onStatusChange={handleStatusChange}
        onSubTaskToggle={handleSubTaskToggle}

      />
    );
  }



  return (
    <div className="space-y-6 mb-6">

      <div className="flex flex-wrap items-center gap-3 mb-4">

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as any)
          }
          className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        >
          <option value="pending">
            Active
          </option>

          <option value="overdue">
            Overdue
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="all">
            All
          </option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
          className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
          className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white"
        />

        {isAdmin && (
          <button
            onClick={() =>
              setShowModal(true)
            }
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        )}
      </div>



      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border border-zinc-700 rounded-xl bg-zinc-900/50 text-zinc-400">
            {filter === "overdue" &&
              "No overdue tasks"}

            {filter === "completed" &&
              "No completed tasks"}

            {filter === "pending" &&
              "No active tasks"}

            {filter === "all" &&
              "No tasks found"}
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-xl transition ${task.status === "completed"
                ? "border-green-500 bg-green-950/20"
                : task.status === "todo" &&
                  task.reviewComment
                  ? "border-red-500 bg-red-950/20"
                  : task.isOverdue
                    ? "border-orange-500 bg-orange-950/20"
                    : task.status === "submitted"
                      ? "border-yellow-500 bg-yellow-950/20"
                      : task.status === "reviewing"
                        ? "border-blue-500 bg-blue-950/20"
                        : "border-zinc-700 bg-zinc-900/50"
                }`}
            >
              <div className="flex items-center justify-between p-5">
                <div
                  onClick={() =>
                    setSelectedTask(task)
                  }
                  className="flex-1 text-left cursor-pointer"
                >
                  <h3 className="font-semibold text-white">
                    {task.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-400">
                    <span>
                      {task.status}
                    </span>

                    <span>
                      {task.priority}
                    </span>

                    {task.dueDate && (
                      <span>
                        Due {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-zinc-500" />

                  {isAdmin && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTask(task);
                        }}
                        className="p-2 border border-zinc-700 rounded-lg hover:bg-zinc-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.id);
                        }}
                        className="p-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <TaskModal
        isOpen={showModal}
        mode="add"
        members={members}
        onClose={() => setShowModal(false)}
        onSave={handleCreate}
      />

      <TaskModal
        isOpen={!!editTask}
        mode="edit"
        members={members}
        initialTask={editTask || undefined}
        onClose={() => setEditTask(null)}
        onSave={handleUpdate}
      />
    </div>
  );
};