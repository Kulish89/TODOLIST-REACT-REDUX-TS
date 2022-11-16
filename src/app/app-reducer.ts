import { Dispatch } from "redux";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null,
  isInitialized: false,
};

// =======================================================

export const appReducer = (
  state: InitialStateType = initialState,
  action: ActionsType
): InitialStateType => {
  switch (action.type) {
    case "APP/SET-ERROR":
      return { ...state, error: action.error };
    case "APP/SET-STATUS":
      return { ...state, status: action.status };
    case "APP/SET-IS-INITIALIZED":
      return { ...state, isInitialized: action.value };
    default:
      return state;
  }
};

// actions============================================

export const setAppErrorAC = (error: string | null) =>
  ({ type: "APP/SET-ERROR", error } as const);

export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: "APP/SET-STATUS", status } as const);

export const setAppInitializedAC = (value: boolean) =>
  ({ type: "APP/SET-IS-INITIALIZED", value } as const);

// thunk====================================================

export const initializeAppTC = () => (dispatch: Dispatch<ActionsType>) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setAppInitializedAC(true));
      dispatch(setIsLoggedInAC(true));
    } else {
    }
    dispatch(setAppInitializedAC(true));
  });
};

// types==================================================

export type ActionsType =
  | ReturnType<typeof setAppErrorAC>
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppInitializedAC>
  | ReturnType<typeof setIsLoggedInAC>;

export type InitialStateType = {
  status: RequestStatusType;
  error: null | string;
  isInitialized: boolean;
};
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
