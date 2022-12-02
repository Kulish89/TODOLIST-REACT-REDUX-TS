import React, { useCallback, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType } from "../../app/store";
import { TodoList } from "./Todolist/TodoList";
import {
  addTodolistTC,
  getTodolistsTC,
  TodolistDomainType,
} from "./Todolist/todolists-reducer";
import { Navigate } from "react-router-dom";

export const TodolistsList = () => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    (state) => state.todolists
  );
  const dispatch = useDispatch();
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    dispatch(getTodolistsTC());
  }, [dispatch, isLoggedIn]);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title));
    },
    [dispatch]
  );
  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  return (
    <div>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <TodoList key={tl.id} id={tl.id} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
