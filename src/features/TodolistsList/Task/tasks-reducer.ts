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

// ==============================================================================

export type ActionsType =
  | ReturnType<typeof removeTaskAC>
  | ReturnType<typeof addTaskAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setTasksAC>
  | ReturnType<typeof updateTaskAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setAppStatusAC>;

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
export const tasksReducer = (
  state: TasksStateType = initialState,
  action: ActionsType
): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(
          (t) => t.id !== action.taskId
        ),
      };
    case "ADD-TASK":
      return {
        ...state,
        [action.task.todoListId]: [
          action.task,
          ...state[action.task.todoListId],
        ],
      };
    case "ADD-TODOLIST":
      return {
        ...state,
        [action.todolist.id]: [],
      };
    case "REMOVE-TODOLIST": {
      const copyState = { ...state };
      delete copyState[action.id];
      return copyState;
    }
    case "SET-TODOLISTS": {
      let copyState = { ...state };
      action.todolists.forEach((tl) => (copyState[tl.id] = []));
      return copyState;
    }
    case "SET-TASKS": {
      const stateCopy = { ...state };
      stateCopy[action.todolistId] = action.tasks;
      return stateCopy;
    }
    case "UPDATE-TASK":
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].map((t) =>
          t.id === action.taskId ? { ...t, ...action.data } : t
        ),
      };

    default:
      return state;
  }
};

// ===================================================================================

export const removeTaskAC = (taskId: string, todolistId: string) =>
  ({ type: "REMOVE-TASK", taskId: taskId, todolistId: todolistId } as const);

export const addTaskAC = (task: TaskType) =>
  ({ type: "ADD-TASK", task } as const);

export const updateTaskAC = (
  taskId: string,
  data: UpdateDomainTaskDataType,
  todolistId: string
) => {
  return { type: "UPDATE-TASK", data, todolistId, taskId } as const;
};
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
  ({ type: "SET-TASKS", tasks, todolistId } as const);

// ===============================================================================

export const getTasksTC =
  (todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.getTasks(todolistId).then((res) => {
      const tasks = res.data.items;
      dispatch(setTasksAC(tasks, todolistId));
      dispatch(setAppStatusAC("succeeded"));
    });
  };
export const removeTaskTC =
  (taskId: string, todolistId: string) => (dispatch: AppThunkDispatch) => {
    todolistAPI.deleteTask(todolistId, taskId).then((res) => {
      dispatch(removeTaskAC(taskId, todolistId));
    });
  };
export const addTaskTC =
  (title: string, todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC("loading"));
    try {
      todolistAPI.createTask(todolistId, title).then((res) => {
        if (res.data.resultCode === 0) {
          dispatch(addTaskAC(res.data.data.item));
          dispatch(setAppStatusAC("succeeded"));
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
          dispatch(updateTaskAC(taskId, apiDataToUpdate, todolistId));
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((e: AxiosError<{ error: string }>) => {
        const error = e.response ? e.response.data.error : e.message;
        handleServerNetworkAppError(error, dispatch);
      });
  };
