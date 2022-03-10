import { supabase } from "./supabaseClient";
import { Provider } from "react-supabase";

export function SupabaseProvider({ children }: any) {
  return <Provider value={supabase}>{children}</Provider>;
}
