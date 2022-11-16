import { Dispatch } from "redux";
import { ResponseType } from "../api/todolists-api";
import { ActionsType, setAppErrorAC, setAppStatusAC } from "../app/app-reducer";

export const handleServerAppError = <D>(
  data: ResponseType<D>,
  dispatch: Dispatch<any>
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
  dispatch: Dispatch<any>
) => {
  dispatch(
    setAppErrorAC(error.message ? error.message : "some error occurred")
  );
  dispatch(setAppStatusAC("failed"));
};
