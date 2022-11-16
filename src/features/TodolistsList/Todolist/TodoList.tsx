import React, { useCallback, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { AppRootStateType } from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { TaskStatuses, TaskType } from "../../../api/todolists-api";
import { EditableSpan } from "../../../components/EditableSpan/EditableSpan";
import { AddItemForm } from "../../../components/AddItemForm/AddItemForm";
import {
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  removeTodolistTC,
  TodolistDomainType,
} from "./todolists-reducer";
import { addTaskTC, getTasksTC } from "../Task/tasks-reducer";
import { Task } from "../Task/Task";

type PropsType = {
  id: string;
};

export const TodoList = React.memo(function (props: PropsType) {
  const todoList = useSelector<AppRootStateType, TodolistDomainType>(
    (state) => state.todolists.filter((tl) => tl.id === props.id)[0]
  );
  const tasks = useSelector<AppRootStateType, Array<TaskType>>(
    (state) => state.tasks[todoList.id]
  );
  useEffect(() => {
    dispatch(getTasksTC(props.id));
  }, []);
  const dispatch = useDispatch();
  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC(title, todoList.id));
    },
    [props.id]
  );

  const removeTodolist = () => {
    dispatch(removeTodolistTC(props.id));
  };
  const changeTodolistTitle = useCallback(
    (title: string) => {
      dispatch(changeTodolistTitleTC(todoList.id, title));
    },
    [props.id]
  );

  const onAllClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC(todoList.id, "all")),
    [props.id]
  );
  const onActiveClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC(todoList.id, "active")),
    [props.id]
  );
  const onCompletedClickHandler = useCallback(
    () => dispatch(changeTodolistFilterAC(todoList.id, "completed")),
    [props.id]
  );

  let tasksForTodolist = tasks;

  if (todoList.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todoList.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todoList.title} onChange={changeTodolistTitle} />
        <IconButton
          onClick={removeTodolist}
          disabled={todoList.entityStatus === "loading"}
        >
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm
        addItem={addTask}
        disabled={todoList.entityStatus === "loading"}
      />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} taskId={t.id} todolistId={todoList.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={todoList.filter === "all" ? "outlined" : "text"}
          onClick={onAllClickHandler}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={todoList.filter === "active" ? "outlined" : "text"}
          onClick={onActiveClickHandler}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todoList.filter === "completed" ? "outlined" : "text"}
          onClick={onCompletedClickHandler}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});
