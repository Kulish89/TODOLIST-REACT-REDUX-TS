import { tasksReducer, TasksStateType } from "../Task/tasks-reducer";
import {
  addTodolistAC,
  TodolistDomainType,
  todolistsReducer,
} from "./todolists-reducer";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodoListsState: Array<TodolistDomainType> = [];
  const action = addTodolistAC({
    id: "123",
    title: "new todolist",
    order: 0,
    addedDate: "",
  });
  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodoListsState, action);
  let keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;
  expect(idFromTasks).toBe(action.todolist.id);
  expect(idFromTodolists).toBe(action.todolist.id);
});
