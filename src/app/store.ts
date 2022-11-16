import { authReducer } from "./../features/Login/auth-reducer";
import { tasksReducer } from "../features/TodolistsList/Task/tasks-reducer";
import { todolistsReducer } from "../features/TodolistsList/Todolist/todolists-reducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { appReducer } from "./app-reducer";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>;
