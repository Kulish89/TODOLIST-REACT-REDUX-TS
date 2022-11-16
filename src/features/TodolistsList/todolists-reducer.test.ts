import { RequestStatusType } from "../../app/app-reducer";
import { v1 } from "uuid";
import {
  addTodolistAC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  FilterValuesType,
  removeTodolistAC,
  setTodolistsAC,
  TodolistDomainType,
  todolistsReducer,
} from "./Todolist/todolists-reducer";

// ==========================================================================

let todoListId1: string;
let todoListId2: string;
let startState: Array<TodolistDomainType>;
beforeEach(() => {
  todoListId1 = v1();
  todoListId2 = v1();
  startState = [
    {
      id: "todolistId1",
      title: "What to learn",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
    {
      id: "todolistId2",
      title: "What to buy",
      filter: "all",
      addedDate: "",
      order: 0,
      entityStatus: "idle",
    },
  ];
});

// ===================================================================

test("correct todoList should be remove", () => {
  const endState = todolistsReducer(startState, removeTodolistAC(todoListId2));
  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todoListId1);
});

test("correct todolist should be added", () => {
  const endState = todolistsReducer(
    startState,
    addTodolistAC({ id: "123", title: "new todolist", order: 0, addedDate: "" })
  );
  expect(endState.length).toBe(3);
  expect(endState[2].title).toBe("new todolist");
  expect(endState[2].filter).toBe("all");
});

test("correct todolist should change it's name", () => {
  let newTodolistTitle = "New Todolist";
  const endState = todolistsReducer(
    startState,
    changeTodolistTitleAC(newTodolistTitle, todoListId2)
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter should be changed", () => {
  let newFilter: FilterValuesType = "completed";
  const action = {
    type: "CHANGE-TODOLIST-FILTER" as const,
    id: todoListId2,
    filter: newFilter,
  };
  const endState = todolistsReducer(
    startState,
    changeTodolistFilterAC(todoListId2, newFilter)
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].filter).toBe(newFilter);
});
test("todolists should be setted", () => {
  const action = setTodolistsAC(startState);
  const endState = todolistsReducer(startState, action);

  expect(endState.length).toBe(2);
});
test("correct entity status should be set", () => {
  let newStatus: RequestStatusType = "loading";

  const endState = todolistsReducer(
    startState,
    changeTodolistEntityStatusAC(todoListId2, newStatus)
  );

  expect(endState[0].filter).toBe("all");
  expect(endState[1].entityStatus).toBe(newStatus);
});
