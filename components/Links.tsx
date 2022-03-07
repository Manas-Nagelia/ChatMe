import { NextPage } from "next";
import { Navbar, NavbarProps } from "@mantine/core";

const Links: NextPage<any> = (props: Omit<NavbarProps, "children">) => {
  return (
    <Navbar {...props}>
      <Navbar.Section>Hello</Navbar.Section>
    </Navbar>
  );
};

export default Links;
