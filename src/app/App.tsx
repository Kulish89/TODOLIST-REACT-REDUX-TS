import React, { useCallback, useEffect } from "react";
import Container from "@mui/material/Container";
import "./App.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Menu } from "@mui/icons-material";
import { Watch } from "../components/Watch/Watch";
import { TodolistsList } from "../features/TodolistsList/TodolistsList";
import { LinearProgress } from "@material-ui/core";
import { ErrorSnackbar } from "../components/ErrorSnackbar/ErrorSnackbar";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStateType, AppThunkDispatch } from "./store";
import { initializeAppTC, RequestStatusType } from "./app-reducer";
import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../features/Login/Login";
import { CircularProgress } from "@mui/material";
import { logoutTC } from "../features/Login/auth-reducer";

function App() {
  const status = useSelector<AppRootStateType, RequestStatusType>(
    (state) => state.app.status
  );
  const isInitialized = useSelector<AppRootStateType, boolean>(
    (state) => state.app.isInitialized
  );
  const isLoggedIn = useSelector<AppRootStateType, boolean>(
    (state) => state.auth.isLoggedIn
  );
  const dispatch: AppThunkDispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAppTC());
  }, [dispatch]);

  const logoutHandler = useCallback(() => {
    dispatch(logoutTC());
  }, [dispatch]);

  if (!isInitialized) {
    return <CircularProgress />;
  }
  return (
    <div className="App">
      <ErrorSnackbar />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6">News</Typography>
          {isLoggedIn && (
            <Button color="inherit" onClick={logoutHandler}>
              Log out
            </Button>
          )}
        </Toolbar>
        <Watch />
      </AppBar>
      {status === "loading" && <LinearProgress />}
      <Container fixed>
        <Routes>
          <Route path="/" element={<TodolistsList />} />
          <Route path="/login" element={<Login />} />
          ​<Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          ​<Route path="/*" element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
