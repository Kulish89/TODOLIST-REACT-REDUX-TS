import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useSelector } from "react-redux";
import { TaskType } from "../../../api/todolists-api";
import { ReduxStoreProviderDecorator } from "../../../decorators/ReduxStoreProviderDecorator";
import { AppRootStateType } from "../../../app/store";
import { Task } from "./Task";

export default {
  title: "Task",
  component: Task,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof Task>;

const TaskWithRedux = () => {
  const task = useSelector<AppRootStateType, TaskType>(
    (state) => state.tasks["todolistId1"][0]
  );
  return <Task todolistId="todolistId1" taskId={task.id} />;
};

export const Template: ComponentStory<typeof TaskWithRedux> = () => (
  <TaskWithRedux />
);
export const TaskWithReduxStory = Template.bind({});
TaskWithReduxStory.args = {};
