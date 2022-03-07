import { NextPage } from "next";
import { Header, HeaderProps, Title } from "@mantine/core";

const MainHeader: NextPage<any> = (props: Omit<HeaderProps, "children">) => {
  return <Header {...props}><Title>Your chats</Title></Header>;
};

export default MainHeader;
