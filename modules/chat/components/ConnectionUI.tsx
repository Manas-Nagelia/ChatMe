import { NextPage } from "next";
import { Paper, Navbar, Button, Space, Container } from "@mantine/core";
import { NameObject } from "../interfaces/NameObject";
import { ConnectionProps } from "../interfaces/ConnectionProps";
import { Text } from "@mantine/core";
import { useRouter } from "next/router";
import { useMantineTheme } from "@mantine/core";

const ConnectionUI: NextPage<ConnectionProps> = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const theme = useMantineTheme();

  console.log(id);
  return (
    <>
      {props.names &&
        props.names.length > 0 &&
        props.names.map((name: NameObject) => (
          <Navbar.Section key={name.id} mt="md">
            <Paper
              sx={(theme) => ({
                backgroundColor:
                  id === name.id ? theme.colors.brand[6] : "white",
                border: `0.5px solid ${theme.colors.gray[9]}`,
                cursor: "pointer",
                transition: "all 200ms ease-in-out",
                ":hover": { border: `0.5px solid ${theme.colors.brand[6]}`, transition: "all 200ms ease-in-out" },
              })}
              padding="xs"
              onClick={(e: any) => console.log("y")}
            >
              <Text
                color={id === name.id ? "#e6e6e6" : theme.colors.dark[9]}
                weight="bold"
              >
                {name.name}
              </Text>
              <Text
                size="xs"
                color={id === name.id ? "#e6e6e6" : theme.colors.gray[7]}
              >{`(${name.email})`}</Text>
            </Paper>
          </Navbar.Section>
        ))}
    </>
  );
};

export default ConnectionUI;
