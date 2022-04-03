import type { NextPage } from "next";
import HomePage from "../components/Home";
import { SessionProps } from "../interfaces/SessionProps";
import Chats from "../modules/chat/components/Chats";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../utils/db/supabaseClient";
import { Profile } from "../modules/auth/interfaces/Profile";
import { useRouter } from "next/router";

const Home: NextPage<SessionProps> = (props) => {
  const router = useRouter();
  useEffect(() => {
    const getProfile = async () => {
      // setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, avatar_url`)
        .eq("id", props.session.user?.id)
        .single();

      const queriedData: Profile = data;

      if (!queriedData) router.push("/getStarted");
    };

    if (props.session) getProfile();
  }, [props.session, router]);

  return (
    <div>
      <Head>
        <title>{!props.session ? "ChatMe" : "Your chat"}</title>
      </Head>
      {!props.session ? <HomePage /> : <Chats />}
    </div>
  );
};

export default Home;
