import { ResponseType } from "../api/todolists-api";
import { setAppErrorAC, setAppStatusAC } from "../app/app-reducer";
import { AppThunkDispatch } from "../app/store";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: AppThunkDispatch
) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]));
  } else {
    dispatch(setAppErrorAC("some error occurred"));
  }
  dispatch(setAppStatusAC("failed"));
};
export const handleServerNetworkAppError = (
  error: any,
  dispatch: AppThunkDispatch
) => {
  dispatch(
    setAppErrorAC(error.message ? error.message : "some error occurred")
  );
  dispatch(setAppStatusAC("failed"));
};
