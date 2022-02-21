import { supabase } from "../db/supabaseClient";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

const useRouteGuard = (session: Session, forwardAuth: boolean = false) => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(true);

  useEffect(() => {
    const user = supabase.auth.user();

    if (!forwardAuth) {
      if (!user) {
        router.push("/auth");
      } else {
        setRedirecting(false);
      }
    } else {
      if (user) {
        router.push("/");
      } else {
        setRedirecting(false);
      }
    }
  }, [session, router, forwardAuth]);

  return redirecting;
};

export default useRouteGuard;
