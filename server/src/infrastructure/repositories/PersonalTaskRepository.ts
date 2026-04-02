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
    const tasks = await PersonalTaskModel.find({ userId }).sort({
      createdAt: -1,
    });

    return tasks.map((task) => ({
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
    }));
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
      if (task.type === "recurring" && task.lastCompletedDate === today) {
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
