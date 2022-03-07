import { NextPage } from "next";
import { AppShell, Header } from "@mantine/core";
import Links from "./Links";
import MainHeader from "./Header";

const Sidebar: NextPage = () => {
  return (
    <AppShell
      padding="md"
      navbar={<Links width={{ base: 300 }} height={500} padding="xs" />}
      header={<MainHeader height={70} padding="xs" />}
    >App content</AppShell>
  );
};

export default Sidebar;
