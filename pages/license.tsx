import {
  Container,
  Global,
  MantineTheme,
  Paper,
  Text,
  Tooltip,
} from "@mantine/core";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const License: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Licensing Information</title>
      </Head>
      <Text m="xs">
        Implementation of&nbsp;
        <Link href="https://www.figma.com/community/file/829741575478342595">
          Avatar Illustration System
        </Link>
        &nbsp;by Micah Lanier. Licensed under
        <Link href="https://creativecommons.org/licenses/by/4.0/">
          &nbsp;CC BY 4.0
        </Link>
        .
      </Text>
    </div>
  );
};

export default License;
