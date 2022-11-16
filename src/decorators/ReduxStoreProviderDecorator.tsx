import React from "react";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { v1 } from "uuid";
import { TaskPriorities, TaskStatuses } from "../api/todolists-api";
import { AppRootStateType } from "../app/store";
import { tasksReducer } from "../features/TodolistsList/Task/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/Todolist/todolists-reducer";

const rootReducer = combineReducers({
  todolists: todolistsReducer,
  tasks: tasksReducer,
});
const initialGlobalState = {
  todolists: [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ],
  tasks: {
    ["todolistId1"]: [
      {
        id: v1(),
        title: "HTML",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: v1(),
        title: "CSS",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: v1(),
        title: "JS/ES6",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
    ],
    ["todolistId2"]: [
      {
        id: v1(),
        title: "Milk",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: v1(),
        title: "Bread",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: v1(),
        title: "Salad",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
    ],
  },
  app: {
    error: null,
    status: "idle",
    isInitialized: false,
  },
  auth: {
    isLoggedIn: false,
  },
};
export const storyBookStore = createStore(
  rootReducer,
  initialGlobalState as AppRootStateType
);

export const ReduxStoreProviderDecorator = (storyFn: () => React.ReactNode) => {
  return <Provider store={storyBookStore}>{storyFn()}</Provider>;
};
