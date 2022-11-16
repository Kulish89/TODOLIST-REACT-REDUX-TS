import { AddItemForm } from "./AddItemForm";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
export default {
  title: "AddItemForm",
  component: AddItemForm,
  argTypes: {
    addItem: {
      descripion: "Clicked",
    },
  },
} as ComponentMeta<typeof AddItemForm>;

export const Template: ComponentStory<typeof AddItemForm> = (args) => (
  <AddItemForm {...args} />
);
export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
  addItem: action("Clicked"),
};
