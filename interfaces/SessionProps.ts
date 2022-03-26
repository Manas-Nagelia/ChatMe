import { Session } from "@supabase/supabase-js";

export interface SessionProps {
  session: Session;
  status: number;
}
