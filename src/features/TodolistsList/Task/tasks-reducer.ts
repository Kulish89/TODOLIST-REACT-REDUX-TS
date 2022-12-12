import { AppRootStateType, AppThunkDispatch } from "../../../app/store";

import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
} from "../../../api/todolists-api";
import { setAppErrorAC, setAppStatusAC } from "../../../app/app-reducer";
import {
  handleServerAppError,
  handleServerNetworkAppError,
} from "../../../utils/error-utils";
import {
  addTodolistAC,
  removeTodolistAC,
  setTodolistsAC,
} from "../Todolist/todolists-reducer";
import axios, { AxiosError } from "axios";
import { Dispatch } from "redux";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ==============================================================================

export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export type UpdateDomainTaskDataType = {
  deadline?: string;
  description?: string;
  priority?: TaskPriorities;
  startDate?: string;
  status?: TaskStatuses;
  title?: string;
};

// ==========================================================================

const initialState: TasksStateType = {};
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    removeTaskAC(
      state,
      action: PayloadAction<{ taskId: string; todolistId: string }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      if (index > -1) tasks.splice(index, 1);
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task);
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        taskId: string;
        data: UpdateDomainTaskDataType;
        todolistId: string;
      }>
    ) {
      const tasks = state[action.payload.todolistId];
      const index = tasks.findIndex(
        (task) => task.id === action.payload.taskId
      );
      if (index > -1)
        tasks[index] = { ...tasks[index], ...action.payload.data };
    },
    setTasksAC(
      state,
      action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>
    ) {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = [];
    });
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.id];
    });
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((tl) => {
        state[tl.id] = [];
      });
    });
  },
});
export const { removeTaskAC, addTaskAC, updateTaskAC, setTasksAC } =
  slice.actions;
export const tasksReducer = slice.reducer;

// ===================================================================================

export const getTasksTC =
  (todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(setTasksAC({ tasks, todolistId }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string) => (dispatch: AppThunkDispatch) => {
    todolistAPI.deleteTask(todolistId, taskId).then((res) => {
      dispatch(removeTaskAC({ taskId, todolistId }));
    });
  };
export const addTaskTC =
  (title: string, todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    try {
      todolistAPI.createTask(todolistId, title).then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC({ task: res.data.data.item }));
          dispatch(setAppStatusAC({ status: "succeeded" }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      });
    } catch (e) {
      if (axios.isAxiosError<{ error: string }>(e)) {
        const error = e.response?.data ? e.response.data.error : e.message;
        handleServerNetworkAppError(error, dispatch);
      }
    }
  };
export const updateTaskTC =
  (
    taskId: string,
    apiDataToUpdate: UpdateDomainTaskDataType,
    todolistId: string
  ) =>
  (dispatch: AppThunkDispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) throw new Error("task not found");
    const dataToUpdate = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      status: task.status,
      title: task.title,
      ...apiDataToUpdate,
    };
    todolistAPI
      .updateTask(todolistId, taskId, dataToUpdate)
      .then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(updateTaskAC({ taskId, data: apiDataToUpdate, todolistId }));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((e: AxiosError<{ error: string }>) => {
        const error = e.response ? e.response.data.error : e.message;
        handleServerNetworkAppError(error, dispatch);
      });
  };
