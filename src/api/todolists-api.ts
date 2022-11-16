import axios from "axios";

const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "35e9e887-e3d6-4312-8e2a-34df7e5725be",
  },
});

// types===========================================================================

export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};
export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}
export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  High = 2,
  Urgently = 3,
  Later = 4,
}
export type ResponseType<T = {}> = {
  resultCode: number;
  messages: Array<string>;
  fieldsErrors: Array<string>;
  data: T;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: Array<TaskType>;
};
export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskdataType = {
  deadline: string;
  description: string;
  priority: TaskPriorities;
  startDate: string;
  status: TaskStatuses;
  title: string;
};

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};
// API========================================================

export const todolistAPI = {
  updateTodolist(todolistId: string, title: string) {
    const promise = instance.put<ResponseType>(`todo-lists/${todolistId}`, {
      title: title,
    });
    return promise;
  },
  deleteTodolist(todolistId: string) {
    const promise = instance.delete<ResponseType>("todo-lists/" + todolistId);
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<ResponseType<{ item: TodolistType }>>(
      "todo-lists",
      { title }
    );
    return promise;
  },
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  getTasks(todolistId: string) {
    const promise = instance.get<GetTasksResponse>(
      "todo-lists/" + todolistId + "/tasks"
    );
    return promise;
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(
      "todo-lists/" + todolistId + "/tasks/" + taskId
    );
  },
  createTask(todolistId: string, taskTitle: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      "todo-lists/" + todolistId + "/tasks",
      {
        title: taskTitle,
      }
    );
  },
  updateTask(todolistId: string, taskId: string, taskData: UpdateTaskdataType) {
    return instance.put<ResponseType>(
      "todo-lists/" + todolistId + "/tasks/" + taskId,
      taskData
    );
  },
};

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId?: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<ResponseType<{ userId?: number }>>("auth/login");
  },
  me() {
    return instance.get<
      ResponseType<{ id: number; email: string; login: string }>
    >("auth/me");
  },
};
