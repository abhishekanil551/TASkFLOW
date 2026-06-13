import { api } from "../axios";

import type {
  Workspace,
  UserRole,
  TaskCreateInput,
  TaskUpdateInput,
} from "../../types/workspace";

export type WorkspacePayload = {
  name: string;

  description: string;

  members: {
    email: string;
  }[];
};

export const workspaceApi = {
  // WORKSPACES
  getAll: async (): Promise<
    Workspace[]
  > => {
    const res =
      await api.get(
        "/workspaces"
      );

    return Array.isArray(
      res.data
    )
      ? res.data
      : res.data
        .workspaces ||
      [];
  },

  getOne: async (
    id: string
  ): Promise<Workspace> => {
    const res =
      await api.get(
        `/workspaces/${id}`
      );

    return res.data;
  },

  create: async (
    data: WorkspacePayload
  ): Promise<Workspace> => {
    const res =
      await api.post(
        "/workspaces",
        data
      );

    return res.data;
  },

  update: async (
    id: string,
    data: WorkspacePayload
  ): Promise<Workspace> => {
    const res =
      await api.patch(
        `/workspaces/${id}`,
        data
      );

    return res.data;
  },

  delete: async (
    id: string
  ): Promise<void> => {
    await api.delete(
      `/workspaces/${id}`
    );
  },

  // MEMBERS
  addMember: async (
    workspaceId: string,
    email: string,
    role: UserRole =
      "member"
  ) => {
    const res =
      await api.post(
        "/workspaces/member",
        {
          workspaceId,
          email,
          role,
        }
      );

    return res.data;
  },

  removeMember: async (
    workspaceId: string,
    memberId: string
  ) => {
    const res =
      await api.delete(
        "/workspaces/member/remove",
        {
          data: {
            workspaceId,
            memberId,
          },
        }
      );

    return res.data;
  },

  updateMemberRole:
    async (
      workspaceId: string,
      memberId: string,
      role: UserRole
    ) => {
      const res =
        await api.patch(
          "/workspaces/member-role",
          {
            workspaceId,
            memberId,
            role,
          }
        );

      return res.data;
    },

  // TASKS
  getTasks: async (
    workspaceId: string
  ) => {
    const res =
      await api.get(
        `/workspaces/${workspaceId}/tasks`
      );

    return res.data;
  },

  addTask: async (
    workspaceId: string,
    task: TaskCreateInput
  ) => {
    const payload = {
      ...task,

      description:
        task.description ||
        "",

      assignedTo:
        task.assignedTo ||
        [],

      attachments:
        task.attachments ||
        [],

      subTasks:
        task.subTasks ||
        [],
    };

    const res =
      await api.post(
        `/workspaces/${workspaceId}/tasks`,
        payload
      );

    return res.data;
  },

  updateTask: async (
    workspaceId: string,
    taskId: string,
    task: TaskUpdateInput
  ) => {
    const payload = {
      ...task,
    };

    const res =
      await api.patch(
        `/workspaces/${workspaceId}/tasks/${taskId}`,
        payload
      );

    return res.data;
  },

  deleteTask: async (
    workspaceId: string,
    taskId: string
  ) => {
    const res =
      await api.delete(
        `/workspaces/${workspaceId}/tasks/${taskId}`
      );

    return res.data;
  },


  updateSubTask: async (
    workspaceId: string,
    taskId: string,
    subTaskId: string,
    completed: boolean
  ) => {
    const res =
      await api.patch(
        `/workspaces/${workspaceId}/tasks/${taskId}/subtasks/${subTaskId}`,
        {
          completed,
        }
      );

    return res.data;
  },
};