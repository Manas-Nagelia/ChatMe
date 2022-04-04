import { Button, createStyles, Group, MantineTheme } from "@mantine/core";
import { Session } from "@supabase/supabase-js";
import type { NextPage } from "next";
import AccountAvatar from "../modules/chat/components/AccountAvatar";
import Logo from "../styles/Logo";
import { useRouter } from "next/router";

interface Props {
  session: Session | null;
}

const useStyles = createStyles((theme: MantineTheme) => ({
  navbar: {
    marginLeft: "150px",
    marginRight: "150px",

    "@media (max-width: 800px)": {
      marginLeft: "50px",
      marginRight: "50px",
    },

    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      marginLeft: "20px",
      marginRight: "20px",
    },
  },

}));

const Navbar: NextPage<Props> = (props) => {
  const router = useRouter();

  const { classes } = useStyles();

  return (
    <>
      <Group position="apart" className={classes.navbar}>
        <Logo />
        {props.session ? (
          <AccountAvatar />
        ) : (
          <Button
            sx={(theme) => ({
              boxShadow: "2px 4px 15px rgba(0, 0, 0, 0.25)",
            })}
            onClick={() => router.push("/auth")}
          >
            Get Started
          </Button>
        )}
      </Group>
    </>
  );
};

export default Navbar;
