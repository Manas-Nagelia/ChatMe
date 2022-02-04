import { Session } from "@supabase/supabase-js";
import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../utils/supabaseClient";

interface AccountProps {
  session: Session;
}

const Account = ({ session }: AccountProps) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`first_name, last_name, avatar_url`)
        .eq("id", user!.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  interface UpdateProfile {
    firstName: string;
    lastName: string;
    avatarUrl: string;
  }

  const updateProfile = async ({
    firstName,
    lastName,
    avatarUrl,
  }: UpdateProfile) => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user!.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after updating
      });

      if (error) throw error;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label htmlFor="email">Email:</label>
      <input id="email" type="text" value={session.user!.email} disabled />
      <label htmlFor="firstName">First Name:</label>
      <input
        id="firstName"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <label htmlFor="lastName">Last Name:</label>
      <input
        id="lastName"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <button
        onClick={() => updateProfile({ firstName, lastName, avatarUrl })}
        disabled={loading}
      >
        {loading ? "Loading..." : "Update"}
      </button>
      <p>{!loading && alert}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
};

export default Account;
