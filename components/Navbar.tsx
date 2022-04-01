import { Button, Group } from "@mantine/core";
import { Session } from "@supabase/supabase-js";
import type { NextPage } from "next";
import AccountAvatar from "../modules/chat/components/AccountAvatar";
import Logo from "../styles/Logo";
import { useRouter } from "next/router";

interface Props {
  session: Session | null;
}

const Navbar: NextPage<Props> = (props) => {
  const router = useRouter();

  return (
    <>
      <Group position="apart" mx={50}>
        <Logo />
        {props.session ? <AccountAvatar /> : <Button>Get Started</Button>}
      </Group>
    </>
  );
};

export default Navbar;
