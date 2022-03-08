import { NextPage } from "next";
import { Paper, Navbar } from "@mantine/core";
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
            <Paper sx={(theme) => ({ backgroundColor: theme.colors.brand[6] })} padding="xs">
              <Text color="white" weight="bold">{name.name}</Text>
              <Text size="xs" color="#e6e6e6">{`(${name.email})`}</Text>
            </Paper>
          </Navbar.Section>
        ))}
    </>
  );
};

export default ConnectionUI;
