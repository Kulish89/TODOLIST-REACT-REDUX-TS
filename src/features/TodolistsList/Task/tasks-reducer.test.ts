import { TodoList } from "../Todolist/TodoList";
import { addTodolistAC } from "../Todolist/todolists-reducer";

import { TaskPriorities, TaskStatuses } from "../../../api/todolists-api";
import {
  addTaskAC,
  removeTaskAC,
  setTasksAC,
  tasksReducer,
  TasksStateType,
  updateTaskAC,
} from "./tasks-reducer";
import {
  removeTodolistAC,
  setTodolistsAC,
} from "../Todolist/todolists-reducer";

// ==============================================================

let startState: TasksStateType;
beforeEach(() => {
  startState = {
    ["todolistId1"]: [
      {
        id: "1",
        title: "HTML",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "CSS",
        completed: false,
        description: "",
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "JS/ES6",
        completed: false,
        description: "",
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId1",
        order: 0,
        addedDate: "",
      },
    ],
    ["todolistId2"]: [
      {
        id: "1",
        title: "Milk",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: "2",
        title: "Bread",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
      {
        id: "3",
        title: "Salad",
        description: "",
        completed: false,
        status: TaskStatuses.New,
        priority: TaskPriorities.Middle,
        startDate: "",
        deadline: "",
        todoListId: "todolistId2",
        order: 0,
        addedDate: "",
      },
    ],
  };
});

// ========================================================

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(startState, removeTaskAC("2", "todoListId2"));
  expect(endState["todoListId1"].length).toBe(3);
  expect(endState["todoListId2"].length).toBe(2);
  expect(endState["todoListId2"].every((t) => t.id !== "2")).toBeTruthy();
});
test("correct task should be added to correct array", () => {
  const endState = tasksReducer(
    startState,
    addTaskAC({
      id: "1",
      title: "juce",
      description: "",
      completed: false,
      status: TaskStatuses.New,
      priority: TaskPriorities.Middle,
      startDate: "",
      deadline: "",
      todoListId: "todoListId2",
      order: 0,
      addedDate: "",
    })
  );
  expect(endState["todoListId1"].length).toBe(3);
  expect(endState["todoListId2"].length).toBe(4);
  expect(endState["todoListId2"][0].id).toBeDefined();
  expect(endState["todoListId2"][0].title).toBe("juce");
  expect(endState["todoListId2"][0].status).toBe(TaskStatuses.New);
});
test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    updateTaskAC("2", { status: TaskStatuses.New }, "todoListId2")
  );
  expect(endState["todoListId2"][1].status).toBe(TaskStatuses.New);
  expect(endState["todoListId1"][1].status).toBe(TaskStatuses.Completed);
});
test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    updateTaskAC("2", { title: "MilkyWay" }, "todoListId2")
  );
  expect(endState["todoListId2"][1].title).toBe("MilkyWay");
  expect(endState["todoListId1"][1].title).toBe("JS");
});
test("new property with new array should be added when new todolist is added", () => {
  const endState = tasksReducer(
    startState,
    addTodolistAC({
      id: "123",
      title: "title is not matter",
      order: 0,
      addedDate: "",
    })
  );
  let keys = Object.keys(endState);
  const newKey = keys.find((k) => k !== "todoListId1" && k !== "todoListId2");
  if (!newKey) {
    throw Error("new key should be added");
  }
  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
test("new property with todolist should be deleted", () => {
  const action = removeTodolistAC("todoListId2");
  const endState = tasksReducer(startState, action);
  let keys = Object.keys(endState);
  expect(keys.length).toBe(1);
  expect(endState["todoListId2"]).toBeUndefined();
});
test("empty arrays should be added when we set todolists", () => {
  const action = setTodolistsAC([
    { id: "1", title: "title 1", order: 0, addedDate: "" },
    { id: "2", title: "title 2", order: 0, addedDate: "" },
  ]);
  const endState = tasksReducer({}, action);
  let keys = Object.keys(endState);
  expect(keys.length).toBe(2);
  expect(endState["1"]).toStrictEqual([]);
  expect(endState["2"]).toStrictEqual([]);
});
test("tasks should be added for todolists", () => {
  const action = setTasksAC(startState["todolistId1"], "todolistId1");
  const endState = tasksReducer({ todolistId2: [], todolist1: [] }, action);
  let keys = Object.keys(endState);
  expect(endState["todolist1"].length).toBe(3);
  expect(endState["todolistId2"]).toBe(0);
});
