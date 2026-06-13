export type SubTask = {
  id: string;

  title: string;

  completed: boolean;

  attachments: string[];
};

export type TaskCommentReply = {
  id: string;

  userId: string;

  userName: string;

  message: string;

  createdAt: string;
};

export type TaskComment = {
  id: string;

  userId: string;

  userName: string;

  message: string;

  createdAt: string;

  replies: TaskCommentReply[];
};

export type TaskActivity = {
  id: string;

  userId: string;

  action: string;

  description: string;

  createdAt: string;
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

export type WorkspaceTaskStatus =
  | "todo"
  | "in-progress"
  | "submitted"
  | "reviewing"
  | "completed";

export type WorkspaceTask = {
  id: string;

  workspaceId: string;

  title: string;

  description: string;

  status: WorkspaceTaskStatus;

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

  submissionAttachments: string[];

  submissionProofs: SubmissionProof[];

  timeline: TaskTimelineItem[];

  subTasks: SubTask[];

  comments: TaskComment[];

  activities: TaskActivity[];

  submittedAt?: string;

  reviewedAt?: string;

  rejectedAt?: string;

  reviewComment?: string;

  warningSent: boolean;

  overdueNotificationSent: boolean;

  isOverdue?: boolean;

  createdAt: string;

  updatedAt: string;
};