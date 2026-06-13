// ROLE
export type UserRole =
  | "admin"
  | "member";

// MEMBER
export type WorkspaceMember = {
  id: string;

  userId?: string;

  email: string;

  name?: string;

  role: UserRole;
};

// SUBTASK
export type SubTask = {
  id: string;

  title: string;

  completed: boolean;

  attachments: string[];
};

// SUBTASK CREATE INPUT
export type SubTaskCreateInput = {
  title: string;

  attachments: string[];
};

// TASK STATUS
export type TaskStatus =
  | "todo"
  | "in-progress"
  | "submitted"
  | "reviewing"
  | "completed";

// TASK
export type Task = {
  id: string;

  title: string;

  description: string;

  status: TaskStatus;

  priority:
  | "low"
  | "medium"
  | "high"
  | "urgent";

  assignedTo: string[];

  leaderId?: string;

  createdBy: string;

  dueDate?: string;

  attachments: string[];

  subTasks: SubTask[];

  submissionAttachments: string[];

  submissionProofs: SubmissionProof[];

  submittedAt?: string;

  reviewedAt?: string;

  reviewComment?: string;

  timeline?: TaskTimelineItem[];

  createdAt: string;

  updatedAt?: string;

  isOverdue?: boolean;
};

// CREATE TASK INPUT
export type TaskCreateInput = {
  title: string;

  description?: string;

  status: TaskStatus;

  priority:
  | "low"
  | "medium"
  | "high"
  | "urgent";

  assignedTo?: string[];

  dueDate?: string;

  attachments?: string[];

  subTasks?: SubTaskCreateInput[];
};

// UPDATE TASK INPUT
export type TaskUpdateInput =
  Partial<TaskCreateInput> & {
    submissionAttachments?: string[];

    submissionProofs?: SubmissionProof[];

    submittedAt?: string;

    reviewedAt?: string;

    reviewComment?: string;

    timeline?: TaskTimelineItem[];
  };

// WORKSPACE
export type Workspace = {
  id: string;

  name: string;

  description: string;

  ownerId?: string;

  icon?: string;

  currentUserId?: string;

  currentUserRole?: UserRole;

  permissions?: {
    canManageWorkspace: boolean;

    canManageMembers: boolean;

    canCreateTasks: boolean;
  };

  members: WorkspaceMember[];

  membersCount?: number;

  tasks: Task[];

  totalTasks?: number;

  completedTasks?: number;

  createdAt?: string;

  updatedAt?: string;
};

export type SubmissionProof = {
  id?: string;

  link: string;

  description: string;

  submittedBy?: string;

  submittedAt?: string;
};

export type TaskTimelineItem = {
  id?: string;

  type:
  | "submission"
  | "rejection"
  | "approval"
  | "comment"
  | "activity";

  userId: string;

  message: string;

  link?: string;

  createdAt: string;
};