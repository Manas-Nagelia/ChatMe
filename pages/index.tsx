import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import HomePage from "../components/Home";
import Account from "../modules/auth/components/Account";
import { Session } from "@supabase/supabase-js";

const Home: NextPage = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{!session ? <HomePage /> : <Account key={session.user!.id} session={session} />}</div>;
};

export default Home;
