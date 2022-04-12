import { NextPage } from "next";
import {
  Header,
  HeaderProps,
  Title,
  Group,
  Divider,
} from "@mantine/core";
import AccountAvatar from "./AccountAvatar";
import Logo from "../../../styles/Logo";

const MainHeader: NextPage<any> = (props: Omit<HeaderProps, "children">) => {
  return (
    <Header {...props}>
      <Group sx={{ height: "100%" }} position="apart">
        <Title>Your chats</Title>
        <AccountAvatar size={45} />
      </Group>
    </Header>
  );
};

export default MainHeader;
