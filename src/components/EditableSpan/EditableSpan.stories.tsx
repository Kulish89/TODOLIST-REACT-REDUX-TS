import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { EditableSpan } from "./EditableSpan";
export default {
  title: "EditableSpan",
  component: EditableSpan,
  argTypes: {
    onChangeTitle: { description: "Clicked" },
  },
} as ComponentMeta<typeof EditableSpan>;

export const Template: ComponentStory<typeof EditableSpan> = (args) => {
  return <EditableSpan {...args} />;
};
export const EditablespanStory = Template.bind({});
EditablespanStory.args = {
  value: "example",
  onChange: action("cahned"),
};
