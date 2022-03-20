import { TextInput, TextInputProps } from "@mantine/core";
import type { NextPage } from "next";

interface Props {
  width: string | number;
}

const StyledInput: NextPage<Props | TextInputProps> = (props) => {
  return (
    <TextInput
      {...props}
      sx={(theme) => ({
        width: props.width,
      })}
    />
  );
};

export default StyledInput;
