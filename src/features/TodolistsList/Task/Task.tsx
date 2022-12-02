import React, { ChangeEvent, useCallback } from "react";
import { Delete } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import { AppRootStateType } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { TaskStatuses, TaskType } from "../../../api/todolists-api";
import { removeTaskTC, updateTaskTC } from "./tasks-reducer";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";

type TaskPropsType = {
  taskId: string;
  todolistId: string;
};
export const Task = React.memo((props: TaskPropsType) => {
  const task = useSelector<AppRootStateType, TaskType>(
    (state) =>
      state.tasks[props.todolistId].filter((t) => t.id === props.taskId)[0]
  );
  const dispatch = useDispatch();
  const removeTask = useCallback(
    () => dispatch(removeTaskTC(task.id, props.todolistId)),
    [props.todolistId, dispatch, task.id]
  );

  const changeTaskStatus = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      let newIsDoneValue = e.currentTarget.checked;
      dispatch(
        updateTaskTC(
          task.id,
          {
            status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New,
          },
          props.todolistId
        )
      );
    },
    [props.todolistId, dispatch, task.id]
  );

  const onTitleChangeHandler = useCallback(
    (newValue: string) => {
      dispatch(updateTaskTC(task.id, { title: newValue }, props.todolistId));
    },
    [props.todolistId, dispatch, task.id]
  );

  return (
    <div
      key={task.id}
      className={task.status === TaskStatuses.Completed ? "is-done" : ""}
    >
      <Checkbox
        checked={task.status === TaskStatuses.Completed}
        color="primary"
        onChange={changeTaskStatus}
      />

      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={removeTask}>
        <Delete />
      </IconButton>
    </div>
  );
});
