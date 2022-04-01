import { Paper, Title } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const HomePage: NextPage = () => {
  return (
    <Paper mt={50} mx={50}>
      <Title>Home Page</Title>
      <Link href="/auth">
        <a>Get started</a>
      </Link>
    </Paper>
  );
};

export default HomePage;
