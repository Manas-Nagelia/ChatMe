import { Avatar, Paper, MantineTheme, Menu, Group } from "@mantine/core";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/db/supabaseClient";

interface Props {
  ml?: "xs" | "sm" | "md" | "lg" | "xl";
  mr?: "xs" | "sm" | "md" | "lg" | "xl";
  size: number;
  id?: string;
}
const UserAvatar: NextPage<Props> = (props) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPath, setAvatarPath] = useState("");

  useEffect(() => {
    const getAvatarUrl = async () => {
      let userID: string;
      if (props.id) userID = props.id;
      else userID = supabase.auth.user()!.id;

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", userID)
        .single();

      if (data && !error) setAvatarUrl(data.avatar_url);
    };

    const downloadImage = async (path: string) => {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);

      if (error) throw error;

      const url = URL.createObjectURL(data!);
      setAvatarPath(url);
    };

    if (supabase.auth.user()) getAvatarUrl();
    if (avatarUrl) downloadImage(avatarUrl);
  }, [avatarUrl]);

  return (
    <>
      {avatarUrl ? (
        <Avatar src={avatarPath} radius="xl" alt="Avatar" size={props.size} />
      ) : (
        <Paper
          sx={(theme: MantineTheme) => ({
            height: 45,
            width: 45,
            backgroundColor: theme.colors.gray[3],
            borderRadius: "100%",
          })}
        />
      )}
    </>
  );
};

export default UserAvatar;
