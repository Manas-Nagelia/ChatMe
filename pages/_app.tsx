import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/db/supabaseClient";
import { SupabaseProvider } from "../utils/db/supabaseProvider";
import { MantineProvider, Global, MantineTheme } from "@mantine/core";
import Head from "next/head";

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
        fontFamily: "Poppins, sans-serif",
        headings: { fontFamily: "Raleway, sans-serif" },
        colors: {
          brand: [
            "#1D2736",
            "#212F44",
            "#253957",
            "#28446F",
            "#29518F",
            "#2661B9",
            "#2D76E4",
            "#6395DF",
            "#9AB7E2",
            "#D2DDEF",
          ],
        },
        primaryColor: "brand",
      }}
    >
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SupabaseProvider>
        <Global
          styles={(theme: MantineTheme) => ({
            body: {
              margin: theme.spacing.xs,
            },
          })}
        />
        <Component {...pageProps} />
      </SupabaseProvider>
    </MantineProvider>
  );
}

export default MyApp;
