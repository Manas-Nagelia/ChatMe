import { NextPage } from "next";
import { Navbar } from "@mantine/core";
import { NameObject } from "../interfaces/NameObject";
import { ConnectionProps } from "../interfaces/ConnectionProps";
import { Text } from "@mantine/core";

const ConnectionUI: NextPage<ConnectionProps> = (props) => {
  return (
    <>
      {props.names &&
        props.names.length > 0 &&
        props.names.map((name: NameObject) => (
          <Navbar.Section key={name.id} mt="md">
            <Text>{name.name}</Text>
          </Navbar.Section>
        ))}
    </>
  );
};

export default ConnectionUI;
