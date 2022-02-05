import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AccountProps } from "../interfaces/AccountProps";
import { UpdateProfile } from "../interfaces/UpdateProfile";
import checkIfEmpty from "../../../utils/services/checkIfEmpty";
import { Profile } from "../interfaces/Profile";
import upsertData from "../../../utils/services/upsertData";

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

      if (error && status !== 406) console.log(error);

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

  const showAlert = (message: string, seconds: number) => {
    setAlert(message);

    setTimeout(() => {
      setAlert("");
    }, seconds * 1000);
  };

  const checkIfFieldsEmpty = () => {
    if (checkIfEmpty(firstName)) {
      return showAlert("Please fill in your first name", 1.5);
    } else if (checkIfEmpty(lastName)) {
      return showAlert("Please fill in your last name", 1.5);
    }
  };

  const updateProfile = async ({
    firstName,
    lastName,
    avatarUrl,
  }: UpdateProfile) => {
    checkIfFieldsEmpty();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates: Profile = {
        id: user!.id,
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const error = await upsertData("profiles", updates);

      if (error) throw error;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      showAlert("Profile updated!", 1.5);
    }
  };

  return (
    <div>
      <form onSubmit={() => updateProfile({ firstName, lastName, avatarUrl })}>
        <label htmlFor="email">Email:</label>
        <input id="email" type="text" value={session.user!.email} disabled />
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={loading}
        />
        <button disabled={loading} type="submit">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <p>{!loading && alert}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
};

export default Account;
