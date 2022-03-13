import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../utils/db/supabaseClient";
import { SessionProps } from "../interfaces/SessionProps";
import { UpdateProfile } from "../modules/auth/interfaces/UpdateProfile";
import checkIfEmpty from "../utils/validation/checkIfEmpty";
import { Profile } from "../modules/auth/interfaces/Profile";
import upsertData from "../utils/db/upsertData";
import { NextPage } from "next";
import removeWhitespace from "../utils/validation/removeWhitespace";
import Avatar from "../modules/auth/components/Avatar";
import useRouteGuard from "../utils/guards/useRouteGuard";
import Redirecting from "../components/Redirecting";
import Head from "next/head";

const Account: NextPage<SessionProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [alert, setAlert] = useState("");

  const redirecting = useRouteGuard(props.session);
  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        const user = supabase.auth.user();
        setEmail(user!.email!);

        let { data, error, status } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url`)
          .eq("id", user!.id)
          .single();

        const queriedData: Profile = data;

        if (!queriedData) {
          const { data, error } = await supabase
            .from("profiles")
            .insert([{ first_name: "", last_name: "", avatar_url: null, email: email }]);

          if (error) console.log(error);
        } else {
          if (error && status !== 406) console.log(error);

          if (queriedData) {
            setFirstName(removeWhitespace(queriedData.first_name));
            setLastName(removeWhitespace(queriedData.last_name));
            setAvatarUrl(removeWhitespace(queriedData.avatar_url));
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (!redirecting) getProfile();
  }, [redirecting, email]);

  const showAlert = (message: string, seconds: number) => {
    setAlert(message);

    setTimeout(() => {
      setAlert("");
    }, seconds * 1000);
  };

  const updateProfile = async (
    { firstName, lastName, avatarUrl }: UpdateProfile,
    e?: FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();
    if (checkIfEmpty(firstName)) {
      return showAlert("Please fill in your first name", 1.5);
    } else if (checkIfEmpty(lastName)) {
      return showAlert("Please fill in your last name", 1.5);
    }

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates: Profile = {
        id: user!.id,
        first_name: capFirstLetter(removeWhitespace(firstName)),
        last_name: capFirstLetter(removeWhitespace(lastName)),
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

  const capFirstLetter = (data: string) => {
    return data.charAt(0).toUpperCase() + data.slice(1);
  };

  if (redirecting) return <Redirecting />;
  else {
    return (
      <div>
        <Head>
          <title>Your account</title>
        </Head>
        <form
          onSubmit={(e) => updateProfile({ firstName, lastName, avatarUrl }, e)}
        >
          <Avatar
            url={avatarUrl}
            size={150}
            onUpload={(url: string) => {
              setAvatarUrl(url);
              updateProfile({ firstName, lastName, avatarUrl: url });
            }}
          />
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email} // session!.user!.email!
            disabled
          />
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={firstName.trim()}
            onChange={(e) =>
              setFirstName(capFirstLetter(removeWhitespace(e.target.value)))
            }
            disabled={loading}
          />
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) =>
              setLastName(capFirstLetter(removeWhitespace(e.target.value)))
            }
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
  }
};

export default Account;
