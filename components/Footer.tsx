import { Center, Container, Global, MantineTheme, Paper } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";

const Footer: NextPage = () => {
  return (
    <Container
      fluid
      sx={(theme) => ({
        backgroundColor: theme.colors.brand[1],
        padding: theme.spacing.xl,
        position: "absolute",
        bottom: 0,
        width: "100%",
      })}
    >
      <Link href="/license" passHref>
        <a style={{ color: "white", textDecoration: "underline" }}>
          License Information
        </a>
      </Link>
    </Container>
  );
};

export default Footer;
