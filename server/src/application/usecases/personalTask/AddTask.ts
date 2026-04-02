import { IPersonalTaskRepository } from "../../../domain/repositories/IPersonalTaskRepository";

export class AddTask {
  constructor(private repo: IPersonalTaskRepository) {}

  async execute(data: {
    title: string;
    description?: string;
    priority: "low" | "medium" | "high" | "urgent";
    userId: string;

    type?: "one-time" | "recurring";
    startDate?: string;
    dueDate?: string;
    days?: string[];
  }) {

    if (!data.title.trim()) {
      throw new Error("Title is required");
    }

    if (data.title.length < 3) {
      throw new Error("Title too short");
    }

    const type = data.type || "one-time";

    if (type === "recurring") {
      if (!data.days || data.days.length === 0) {
        throw new Error("Select at least one day");
      }
    }

    if (type === "one-time" && data.dueDate) {
      const today = new Date().toISOString().split("T")[0];

      if (data.dueDate < today) {
        throw new Error("Due date cannot be in past");
      }
    }

    return this.repo.create({
      title: data.title,
      description: data.description ?? "",
      priority: data.priority,
      userId: data.userId,

      type,
      days: data.days || [],

      startDate: data.startDate || "",   
      dueDate: data.dueDate || "",       

      status: "todo",
      timeSpent: 0,
      isTimerRunning: false,
    });
  }
}