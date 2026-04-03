export interface PersonalTask {
  id?: string;
  userId: string;

  title: string;
  description?: string;

  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";

  type: "one-time" | "recurring";
  days?: string[];

  startDate?: string;
  dueDate?: string;

  timeSpent: number;
  isTimerRunning: boolean;
  lastStartedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lastCompletedDate?: string;
}

export type TaskFilters = {
  search?: string;
  status?: string;
  priority?: string;
};

export type PaginatedTasks = {
  data: PersonalTask[];
  total: number;
  page: number;
  totalPages: number;
};