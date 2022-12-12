import { handleServerNetworkAppError } from "./../../../utils/error-utils";
import { RequestStatusType } from "../../../app/app-reducer";
import { todolistAPI, TodolistType } from "../../../api/todolists-api";
import { setAppErrorAC, setAppStatusAC } from "../../../app/app-reducer";
import { AxiosError } from "axios";
import { AppThunkDispatch } from "../../../app/store";
import { getTasksTC } from "../Task/tasks-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ================================================================================

export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// ================================================================================

const initialState: Array<TodolistDomainType> = [];

const slice = createSlice({
  name: "todolists",
  initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index > -1) state.splice(index, 1);
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      });
    },
    changeTodolistTitleAC(
      state,
      action: PayloadAction<{ id: string; title: string }>
    ) {
      const tl = state.find((tl) => tl.id === action.payload.id);
      if (tl) tl.title = action.payload.title;
    },
    changeTodolistFilterAC(
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) {
      const tl = state.find((tl) => tl.id === action.payload.id);
      if (tl) tl.filter = action.payload.filter;
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) {
      const tl = state.find((tl) => tl.id === action.payload.id);
      if (tl) tl.entityStatus = action.payload.status;
    },
    setTodolistsAC(
      state,
      action: PayloadAction<{ todolists: Array<TodolistType> }>
    ) {
      return action.payload.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    },
  },
});
export const {
  removeTodolistAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  changeTodolistEntityStatusAC,
  setTodolistsAC,
} = slice.actions;
export const todolistsReducer = slice.reducer;

// ===============================================

export const getTodolistsTC = () => (dispatch: AppThunkDispatch) => {
  dispatch(setAppStatusAC({ status: "loading" }));
  todolistAPI
    .getTodolists()
    .then((res) => {
      dispatch(setTodolistsAC({ todolists: res.data }));

      return res.data;
    })
    .then((todos: Array<TodolistType>) => {
      todos.forEach((tl) => {
        dispatch(getTasksTC(tl.id));
      });
      dispatch(setAppStatusAC({ status: "succeeded" }));
    })
    .catch((e: AxiosError<{ error: string }>) => {
      const error = e.response ? e.response.data.error : e.message;
      handleServerNetworkAppError(error, dispatch);
    });
};
export const removeTodolistTC =
  (todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    dispatch(
      changeTodolistEntityStatusAC({ id: todolistId, status: "loading" })
    );
    todolistAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC({ id: todolistId }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    });
  };
export const addTodolistTC =
  (title: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC({ status: "loading" }));
    todolistAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC({ todolist: res.data.data.item }));
      dispatch(setAppStatusAC({ status: "succeeded" }));
    });
  };
export const changeTodolistTitleTC =
  (todolistId: string, title: string) => (dispatch: AppThunkDispatch) => {
    todolistAPI.updateTodolist(todolistId, title).then((res) => {
      dispatch(changeTodolistTitleAC({ id: todolistId, title }));
    });
  };
