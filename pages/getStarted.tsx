import {
  Button,
  Title,
  Paper,
  MantineTheme,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import type { NextPage } from "next";
import StyledInput from "../styles/Input";
import { supabase } from "../utils/db/supabaseClient";
import { useEffect, useState } from "react";
import removeWhitespace from "../utils/validation/removeWhitespace";
import * as style from "@dicebear/avatars-initials-sprites";
import { createAvatar } from "@dicebear/avatars";
import { Profile } from "../modules/auth/interfaces/Profile";
import { useRouter } from "next/router";
import Redirecting from "../components/Redirecting";

const GetStarted: NextPage<any> = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const getProfile = async () => {
      try {
        setRedirecting(true);
        const user = supabase.auth.user();

        let { data, error } = await supabase
          .from("profiles")
          .select(`first_name, last_name, avatar_url`)
          .eq("id", user!.id)
          .single();

        const queriedData: Profile = data;

        if (queriedData) {
          router.push("/account");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setRedirecting(false);
      }
    };

    if (!redirecting) getProfile();
  }, [router]);
  const generateRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
  };

  const generateSeed = () => {
    const firstNameLetter = firstName.charAt(0);
    const lastNameLetter = lastName.charAt(0);
    const seed = firstNameLetter + lastNameLetter + generateRandomInt();
    return seed.toString();
  };

  const insertData = async () => {
    setLoading(true);
    const svg = createAvatar(style, {
      seed: generateSeed(),
      radius: 50,
      fontSize: 44,
    });

    const svgBlob = new Blob([svg], { type: "image/svg+xml" });
    const svgFile = new File([svgBlob], "avatar.svg", {
      type: "image/svg+xml",
    });

    const fileExt = "svg";
    const fileName = `${generateRandomInt()}.${fileExt}`;
    const filePath = `${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, svgFile);

    if (uploadError) throw uploadError;

    const { data, error } = await supabase.from("profiles").insert([
      {
        id: supabase.auth.user()?.id!,
        updated_at: new Date(),
        first_name: firstName,
        last_name: lastName,
        avatar_url: filePath,
        email: supabase.auth.user()?.email!,
      },
    ]);

    if (error) {
      console.log(error);
    } else {
      setLoading(false);
      router.push("/");
    }
  };

  if (redirecting) return <Redirecting />;
  else {
    return (
      <Paper mt="xs" ml="sm">
        <Title
          my="lg"
          sx={(theme: MantineTheme) => ({
            [`@media (max-width: ${theme.breakpoints.md}px)`]: {
              textAlign: "center",
            },
          })}
        >
          Let&apos;s get you started
        </Title>
        <Paper style={{ width: "30%" /* margin: "50 auto" */ }}>
          <LoadingOverlay visible={loading} transitionDuration={0} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              insertData();
            }}
          >
            <StyledInput
              label="First Name"
              placeholder="Your first name"
              required
              width="100%"
              value={firstName}
              onChange={(e) => setFirstName(removeWhitespace(e.target.value))}
            />
            <StyledInput
              label="Last Name"
              placeholder="Your last name"
              required
              mt="sm"
              width="100%"
              value={lastName}
              onChange={(e) => setLastName(removeWhitespace(e.target.value))}
            />
            <Button type="submit" mt="md" disabled={loading}>
              {!loading ? "Submit" : "Loading..."}
            </Button>
          </form>
        </Paper>
      </Paper>
    );
  }
};

export default GetStarted;
