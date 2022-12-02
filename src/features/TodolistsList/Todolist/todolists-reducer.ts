import { handleServerNetworkAppError } from "./../../../utils/error-utils";
import { RequestStatusType } from "../../../app/app-reducer";
import { todolistAPI, TodolistType } from "../../../api/todolists-api";
import { setAppErrorAC, setAppStatusAC } from "../../../app/app-reducer";
import { AxiosError } from "axios";
import { AppThunkDispatch } from "../../../app/store";
import { getTasksTC } from "../Task/tasks-reducer";

// ================================================================================

export type FilterValuesType = "all" | "active" | "completed";

type ActionsType =
  | ReturnType<typeof removeTodolistAC>
  | ReturnType<typeof addTodolistAC>
  | ReturnType<typeof changeTodolistTitleAC>
  | ReturnType<typeof changeTodolistFilterAC>
  | ReturnType<typeof setTodolistsAC>
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof changeTodolistEntityStatusAC>;

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

// ================================================================================

const initialState: Array<TodolistDomainType> = [];
export const todolistsReducer = (
  state: Array<TodolistDomainType> = initialState,
  action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case "REMOVE-TODOLIST":
      return state.filter((tl) => tl.id !== action.id);
    case "ADD-TODOLIST":
      return [
        { ...action.todolist, filter: "all", entityStatus: "idle" },
        ...state,
      ];
    case "CHANGE-TODOLIST-TITLE":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, title: action.title } : tl
      );
    case "CHANGE-TODOLIST-FILTER":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, filter: action.filter } : tl
      );
    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map((tl) =>
        tl.id === action.id ? { ...tl, entityStatus: action.status } : tl
      );
    case "SET-TODOLISTS":
      return action.todolists.map((tl) => ({
        ...tl,
        filter: "all",
        entityStatus: "idle",
      }));
    default:
      return state;
  }
};

// ============================================================================

export const removeTodolistAC = (todolistId: string) =>
  ({ type: "REMOVE-TODOLIST", id: todolistId } as const);
export const addTodolistAC = (todolist: TodolistType) =>
  ({ type: "ADD-TODOLIST", todolist } as const);
export const changeTodolistTitleAC = (id: string, title: string) =>
  ({ type: "CHANGE-TODOLIST-TITLE", id: id, title: title } as const);
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
  ({ type: "CHANGE-TODOLIST-FILTER", id, filter } as const);
export const changeTodolistEntityStatusAC = (
  id: string,
  status: RequestStatusType
) => ({ type: "CHANGE-TODOLIST-ENTITY-STATUS", id, status } as const);
export const setTodolistsAC = (todolists: Array<TodolistType>) =>
  ({ type: "SET-TODOLISTS", todolists } as const);

// ==============================================================================

export const getTodolistsTC = () => (dispatch: AppThunkDispatch) => {
  dispatch(setAppStatusAC("loading"));
  todolistAPI
    .getTodolists()
    .then((res) => {
      dispatch(setTodolistsAC(res.data));

      return res.data;
    })
    .then((todos: Array<TodolistType>) => {
      todos.forEach((tl) => {
        dispatch(getTasksTC(tl.id));
      });
      dispatch(setAppStatusAC("succeeded"));
    })
    .catch((e: AxiosError<{ error: string }>) => {
      const error = e.response ? e.response.data.error : e.message;
      handleServerNetworkAppError(error, dispatch);
    });
};
export const removeTodolistTC =
  (todolistId: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC("loading"));
    dispatch(changeTodolistEntityStatusAC(todolistId, "loading"));
    todolistAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(removeTodolistAC(todolistId));
      dispatch(setAppStatusAC("succeeded"));
    });
  };
export const addTodolistTC =
  (title: string) => (dispatch: AppThunkDispatch) => {
    dispatch(setAppStatusAC("loading"));
    todolistAPI.createTodolist(title).then((res) => {
      dispatch(addTodolistAC(res.data.data.item));
      dispatch(setAppStatusAC("succeeded"));
    });
  };
export const changeTodolistTitleTC =
  (todolistId: string, title: string) => (dispatch: AppThunkDispatch) => {
    todolistAPI.updateTodolist(todolistId, title).then((res) => {
      dispatch(changeTodolistTitleAC(todolistId, title));
    });
  };
