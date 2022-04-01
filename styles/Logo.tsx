import { NextPage } from "next";
import AppLogo from "../public/Logo.svg";
import Image from "next/image";
import { Container, createStyles, Paper } from "@mantine/core";
import router from "next/router";

interface Props {
  logoSize?: number | string;
}
const Logo: NextPage<Props> = (props) => {
  const useStyles = createStyles(() => ({
    pointer: {
      cursor: "pointer",
    },
  }));

  const { classes } = useStyles();

  return (
    <>
      <Image
        src={AppLogo}
        width={props.logoSize ? props.logoSize : "150%"}
        className={classes.pointer}
        onClick={() => router.push("/")}
        alt="ChatMe Logo"
      />
    </>
  );
};

export default Logo;
