import { supabase } from "../db/supabaseClient";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

const useRouteGuard = (session: Session) => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const user = supabase.auth.user();

    if (!user) {
      router.push("/auth");
    } else {
      setRedirecting(false);
    }
  }, [session, router]);

  return redirecting;
};

export default useRouteGuard;
