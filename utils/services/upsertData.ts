import { supabase } from "../../modules/auth/utils/supabaseClient";

const upsertData = async (table: string, updates: any) => {
  const { error } = await supabase.from(table).upsert(updates, {
    returning: "minimal", // Don't return the value after updating
  });

  return error;
};

export default upsertData;
