export interface Task {
  id?: string;

  title: string;
  description?: string;

  type?: "one-time" | "recurring";
  startDate?: string;
  dueDate?: string;
  days?: string[];

  status?: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";

  timeSpent?: number;
  isTimerRunning?: boolean;
  lastCompletedDate?: string;
}
