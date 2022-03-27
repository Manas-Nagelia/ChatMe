import { Anchor } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const Navbar: NextPage = () => {
  return (
    <>
      <Anchor href="/">Home</Anchor>
      <Anchor href="/account" ml="xl">Account</Anchor>
    </>
  );
};

export default Navbar;
