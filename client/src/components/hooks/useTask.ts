import { TaskApi } from "../../infrastructure/task/TaskApi";
import type { Task } from "../../domain/entities/Task";

const taskApi = new TaskApi();

export const useTask = () => {
  const addTask = async (data: Task) => {
    return taskApi.addTask(data);
  };

  const updateTask = async (id: string, data: Task) => {
    return taskApi.updateTask(id, data);
  };

  const getTasks = async () => {
    return taskApi.getTasks();
  };

  const toggleTimer = async (id: string) => {
    return taskApi.toggleTimer(id);
  };

  const completeTask = async (id: string) => {
    return taskApi.completeTask(id);
  };

  const deleteTask = async (id: string) => {
    return taskApi.deleteTask(id);
  };

  return {
    addTask,
    updateTask,
    getTasks,
    toggleTimer,
    completeTask,
    deleteTask,
  };
};
