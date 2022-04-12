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
import {
  Button,
  Center,
  Container,
  Global,
  Paper,
  TextInput,
  Notification
} from "@mantine/core";
import { MdAlternateEmail } from "react-icons/md";
import { useRouter } from "next/router";

const Account: NextPage<SessionProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [alert, setAlert] = useState("");
  const [shown, setShown] = useState(false);
 
  const router = useRouter();

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
          router.push("/getStarted");
        } else {
          if (error && status !== 406) console.log(error);

          if (queriedData) {
            setFirstName(removeWhitespace(queriedData.first_name));
            setLastName(removeWhitespace(queriedData.last_name));
            setAvatarUrl(queriedData.avatar_url);
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (!redirecting) getProfile();
  }, [redirecting, email, router]);

  const updateProfile = async (
    { firstName, lastName, avatarUrl }: UpdateProfile,
    e?: FormEvent<HTMLFormElement>
  ) => {
    if (e) e.preventDefault();
    if (checkIfEmpty(firstName)) {
      setShown(false);
      return setAlert("Please fill in your first name");
    } else if (checkIfEmpty(lastName)) {
      setShown(false);
      return setAlert("Please fill in your last name");
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

      const error = await supabase.from("profiles").update(updates);

      if (error) throw error;
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setShown(true);
      setAlert("Profile updated!");
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
        <Center mt={100}>
          <Paper
            sx={(theme) => ({
              backgroundColor: "#f7f7f7",
              width: "75%",
            })}
            padding={30}
          >
            <Center>
              <form
                onSubmit={(e) =>
                  updateProfile({ firstName, lastName, avatarUrl }, e)
                }
              >
                <Avatar
                  url={avatarUrl}
                  size={150}
                  onUpload={(url: string) => {
                    setAvatarUrl(url);
                    updateProfile({ firstName, lastName, avatarUrl: url });
                  }}
                />
                <TextInput
                  label="First name"
                  id="firstName"
                  value={firstName.trim()}
                  onChange={(e) =>
                    setFirstName(
                      capFirstLetter(removeWhitespace(e.target.value))
                    )
                  }
                  disabled={loading}
                />
                <TextInput
                  label="Last name"
                  id="lastName"
                  value={lastName.trim()}
                  onChange={(e) =>
                    setLastName(
                      capFirstLetter(removeWhitespace(e.target.value))
                    )
                  }
                  disabled={loading}
                />
                <Button loading={loading} type="submit" mt="md">
                  Update Profile
                </Button>
              </form>
            </Center>
          </Paper>
        </Center>
       {shown && <Notification onClose={() => setShown(false)}>{alert}</Notification>}
      </div>
    );
  }
};

export default Account;
