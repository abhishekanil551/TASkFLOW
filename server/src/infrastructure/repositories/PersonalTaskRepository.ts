import { PersonalTask } from "../../domain/entities/PersonalTask";
import { PersonalTaskModel } from "../models/PersonalTaskModel";
import { IPersonalTaskRepository } from "../../domain/repositories/IPersonalTaskRepository";

export class PersonalTaskRepository implements IPersonalTaskRepository {
  async create(task: PersonalTask): Promise<PersonalTask> {
    const created = await PersonalTaskModel.create(task);

    return {
      id: created._id.toString(),
      userId: created.userId,
      title: created.title,
      description: created.description,
      status: created.status,
      priority: created.priority,

      type: created.type,
      days: created.days || [],

      startDate: created.startDate || "",
      dueDate: created.dueDate || "",

      timeSpent: created.timeSpent,
      isTimerRunning: created.isTimerRunning,

      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  async findByUserId(userId: string): Promise<PersonalTask[]> {
    const tasks = await PersonalTaskModel.find({ userId });

    const today = new Date().toISOString().split("T")[0];

    const todayDay = new Date()
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();

    const priorityOrder: Record<string, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const statusOrder: Record<string, number> = {
      "in-progress": 3,
      todo: 2,
      completed: 1,
    };

    return tasks

      .filter((task) => {
        if (task.type === "recurring") {
          if (!(task.days || []).includes(todayDay)) return false;
        }

        const isCompletedOverdue =
          task.status === "completed" && task.dueDate && task.dueDate < today;

        if (isCompletedOverdue) return false;

        return true;
      })

      .map((task) => {
        let status = task.status;
        let timeSpent = task.timeSpent;
        let lastStartedAt = task.lastStartedAt;

        if (task.type === "recurring") {
          if (
            task.status === "completed" &&
            task.lastCompletedDate &&
            task.lastCompletedDate !== today
          ) {
            status = "todo";
            timeSpent = 0;
            lastStartedAt = null;
          }
        }

        if (task.isTimerRunning && task.lastStartedAt) {
          const diff = Math.floor(
            (Date.now() - new Date(task.lastStartedAt).getTime()) / 1000,
          );
          timeSpent += diff;
        }

        return {
          id: task._id.toString(),
          userId: task.userId,
          title: task.title,
          description: task.description,
          status,
          priority: task.priority,

          type: task.type,
          days: task.days || [],

          startDate: task.startDate || "",
          dueDate: task.dueDate || "",

          timeSpent,
          isTimerRunning: task.isTimerRunning,

          lastStartedAt: task.lastStartedAt
            ? task.lastStartedAt.toISOString()
            : null,

          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        };
      })

      .sort((a, b) => {
        const aOverdue =
          a.dueDate && a.dueDate < today && a.status !== "completed";
        const bOverdue =
          b.dueDate && b.dueDate < today && b.status !== "completed";

        if (aOverdue !== bOverdue) return aOverdue ? -1 : 1;

        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[b.status] - statusOrder[a.status];
        }

        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }

        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }

  async findById(id: string): Promise<PersonalTask | null> {
    const task = await PersonalTaskModel.findById(id);
    if (!task) return null;

    return {
      id: task._id.toString(),
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,

      type: task.type,
      days: task.days || [],

      startDate: task.startDate || "",
      dueDate: task.dueDate || "",

      timeSpent: task.timeSpent,
      isTimerRunning: task.isTimerRunning,

      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  async update(
    id: string,
    updates: Partial<PersonalTask>,
  ): Promise<PersonalTask | null> {
    const updated = await PersonalTaskModel.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
    });

    if (!updated) return null;

    return {
      id: updated._id.toString(),
      userId: updated.userId,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,

      type: updated.type,
      days: updated.days || [],

      startDate: updated.startDate || "",
      dueDate: updated.dueDate || "",

      timeSpent: updated.timeSpent,
      isTimerRunning: updated.isTimerRunning,

      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async delete(id: string): Promise<boolean> {
    const result = await PersonalTaskModel.findByIdAndDelete(id);
    return !!result;
  }

  async updateTimer(id: string): Promise<PersonalTask | null> {
    const task = await PersonalTaskModel.findById(id);
    if (!task) return null;

    let newTimeSpent = task.timeSpent;
    let isRunning = task.isTimerRunning;
    let lastStartedAt = task.lastStartedAt;
    let status = task.status;

    const today = new Date().toISOString().split("T")[0];

    if (!isRunning) {
      if (task.type === "recurring" && task.lastCompletedDate !== today) {
        newTimeSpent = 0;
        task.lastCompletedDate = "";
      }

      isRunning = true;
      lastStartedAt = new Date();

      status = "in-progress";
    } else {
      isRunning = false;

      if (lastStartedAt) {
        const diff = Math.floor(
          (Date.now() - new Date(lastStartedAt).getTime()) / 1000,
        );
        newTimeSpent += diff;
      }

      lastStartedAt = null;
    }

    const updated = await PersonalTaskModel.findByIdAndUpdate(
      id,
      {
        timeSpent: newTimeSpent,
        isTimerRunning: isRunning,
        lastStartedAt,
        status,
      },
      { returnDocument: "after" },
    );

    if (!updated) return null;

    return {
      id: updated._id.toString(),
      userId: updated.userId,
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,

      type: updated.type,
      days: updated.days || [],

      startDate: updated.startDate || "",
      dueDate: updated.dueDate || "",

      timeSpent: updated.timeSpent,
      isTimerRunning: updated.isTimerRunning,
      lastStartedAt: updated.lastStartedAt
        ? updated.lastStartedAt.toISOString()
        : null,

      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
