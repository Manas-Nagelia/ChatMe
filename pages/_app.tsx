import "../styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/db/supabaseClient";

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  
  Object.assign(pageProps, { session });
  
  return <Component {...pageProps} />;
}

export default MyApp;
