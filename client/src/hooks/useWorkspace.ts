import { useCallback } from "react";

import {
  workspaceApi,
  type WorkspacePayload,
} from "../api/workspace/WorkspaceApi";

import type {
  Workspace,
  UserRole,
  TaskCreateInput,
  TaskUpdateInput,
} from "../types/workspace";

export const useWorkspace =
  () => {
    // WORKSPACES
    const getWorkspaces =
      useCallback(
        async (): Promise<
          Workspace[]
        > => {
          return workspaceApi.getAll();
        },
        []
      );

    const getWorkspaceById =
      useCallback(
        async (
          id: string
        ): Promise<Workspace> => {
          return workspaceApi.getOne(
            id
          );
        },
        []
      );

    const createWorkspace =
      useCallback(
        async (
          data: WorkspacePayload
        ) => {
          return workspaceApi.create(
            data
          );
        },
        []
      );

    const updateWorkspace =
      useCallback(
        async (
          id: string,
          data: WorkspacePayload
        ) => {
          return workspaceApi.update(
            id,
            data
          );
        },
        []
      );

    const deleteWorkspace =
      useCallback(
        async (
          id: string
        ) => {
          return workspaceApi.delete(
            id
          );
        },
        []
      );

    // MEMBERS
    const addMember =
      useCallback(
        async (
          workspaceId: string,
          email: string,
          role: UserRole =
            "member"
        ) => {
          return workspaceApi.addMember(
            workspaceId,
            email,
            role
          );
        },
        []
      );

    const removeMember =
      useCallback(
        async (
          workspaceId: string,
          memberId: string
        ) => {
          return workspaceApi.removeMember(
            workspaceId,
            memberId
          );
        },
        []
      );

    const updateMemberRole =
      useCallback(
        async (
          workspaceId: string,
          memberId: string,
          role: UserRole
        ) => {
          return workspaceApi.updateMemberRole(
            workspaceId,
            memberId,
            role
          );
        },
        []
      );

    // TASKS
    const getWorkspaceTasks =
      useCallback(
        async (
          workspaceId: string
        ) => {
          return workspaceApi.getTasks(
            workspaceId
          );
        },
        []
      );

    const addTask =
      useCallback(
        async (
          workspaceId: string,
          task: TaskCreateInput
        ) => {
          return workspaceApi.addTask(
            workspaceId,
            task
          );
        },
        []
      );

    const updateTask =
      useCallback(
        async (
          workspaceId: string,
          taskId: string,
          task: TaskUpdateInput
        ) => {
          return workspaceApi.updateTask(
            workspaceId,
            taskId,
            task
          );
        },
        []
      );


    const updateSubTask =
      useCallback(
        async (
          workspaceId: string,
          taskId: string,
          subTaskId: string,
          completed: boolean
        ) => {
          return workspaceApi.updateSubTask(
            workspaceId,
            taskId,
            subTaskId,
            completed
          );
        },
        []
      );

    const deleteTask =
      useCallback(
        async (
          workspaceId: string,
          taskId: string
        ) => {
          return workspaceApi.deleteTask(
            workspaceId,
            taskId
          );
        },
        []
      );

    return {
      // WORKSPACES
      getWorkspaces,
      getWorkspaceById,
      createWorkspace,
      updateWorkspace,
      deleteWorkspace,

      // MEMBERS
      addMember,
      removeMember,
      updateMemberRole,

      // TASKS
      getWorkspaceTasks,
      addTask,
      updateTask,
      deleteTask,
      updateSubTask,
    };
  };