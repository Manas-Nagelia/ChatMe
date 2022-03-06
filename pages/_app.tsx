import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/db/supabaseClient";
import { SupabaseProvider } from "../utils/db/supabaseProvider";
import { MantineProvider } from "@mantine/core";

function MyApp({ Component, pageProps }: AppProps) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  Object.assign(pageProps, { session });

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        headings: { fontFamily: "Raleway, sans-serif" },
      }}
    >
      <SupabaseProvider>
        <Component {...pageProps} />
      </SupabaseProvider>
    </MantineProvider>
  );
}

export default MyApp;
