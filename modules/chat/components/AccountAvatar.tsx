import { Avatar, Paper, MantineTheme, Menu, Group } from "@mantine/core";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { MdSettings } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { supabase } from "../../../utils/db/supabaseClient";
import { useRouter } from "next/router";

interface Props {
  ml?: "xs" | "sm" | "md" | "lg" | "xl";
  mr?: "xs" | "sm" | "md" | "lg" | "xl";
  size: number;
}
const AccountAvatar: NextPage<Props> = (props) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarPath, setAvatarPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getAvatarUrl = async () => {
      let userID: string = supabase.auth.user()!.id;

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
      <Menu
        control={
          avatarUrl ? (
            <Avatar
              src={avatarPath}
              radius="xl"
              alt="Avatar"
              size={props.size}
            />
          ) : (
            <Paper
              sx={(theme: MantineTheme) => ({
                height: 45,
                width: 45,
                backgroundColor: theme.colors.gray[3],
                borderRadius: "100%",
              })}
            />
          )
        }
        sx={{ cursor: "pointer" }}
        trigger="hover"
        delay={200}
      >
        <Menu.Item
          icon={<MdSettings size={20} />}
          onClick={() => router.push("/account")}
        >
          Settings
        </Menu.Item>
        <Menu.Item
          icon={<IoMdExit size={20} />}
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Menu.Item>
      </Menu>
    </>
  );
};

export default AccountAvatar;
