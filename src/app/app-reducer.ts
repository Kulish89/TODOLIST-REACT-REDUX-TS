import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import { authAPI } from "../api/todolists-api";
import { setIsLoggedInAC } from "../features/Login/auth-reducer";
import { AppThunkDispatch } from "./store";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as null | string,
  isInitialized: false,
};

// =======================================================
const slice = createSlice({
  initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error;
    },
    setAppStatusAC(
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) {
      state.status = action.payload.status;
    },
    setAppInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value;
    },
  },
  name: "app",
});
export const { setAppErrorAC, setAppStatusAC, setAppInitializedAC } =
  slice.actions;
export const appReducer = slice.reducer;

// thunk====================================================

export const initializeAppTC = () => (dispatch: AppThunkDispatch) => {
  authAPI.me().then((res) => {
    if (res.data.resultCode === 0) {
      dispatch(setAppInitializedAC({ value: true }));
      dispatch(setIsLoggedInAC({ value: true }));
    } else {
    }
    dispatch(setAppInitializedAC({ value: true }));
  });
};

// types==================================================

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";
