import { NextPage } from "next";
import {
  Header,
  HeaderProps,
  Title,
  Group,
} from "@mantine/core";
import AccountAvatar from "./AccountAvatar";

const MainHeader: NextPage<any> = (props: Omit<HeaderProps, "children">) => {
  return (
    <Header {...props}>
      <Group sx={{ height: "100%" }} position="apart">
        <Title>Your chats</Title>
        <AccountAvatar />
      </Group>
    </Header>
  );
};

export default MainHeader;
