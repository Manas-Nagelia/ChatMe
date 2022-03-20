import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import { Avatar as AvatarProps } from "../interfaces/Avatar";
import Image from "next/image";
import { Avatar as AvatarImage } from "@mantine/core";

const Avatar: NextPage<AvatarProps> = (props) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    const downloadImage = async (path: string) => {
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(path);

        if (error) throw error;

        const url = URL.createObjectURL(data!);
        setAvatarUrl(url);
      } catch (err: any) {
        if (err.message === "The resource was not found") {
          showAlert("Oops, the image was not found.", 2);
        } else console.log("Error downloading image: ", err.message);
      }
    };

    if (props.url) downloadImage(props.url);
  }, [props.url]);

  const showAlert = (message: string, seconds: number) => {
    setAlert(message);

    setTimeout(() => {
      setAlert("");
    }, seconds * 1000);
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0)
        throw new Error("You must select an image to upload.");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.floor(
        Math.random() * 1000000000000
      )}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      props.onUpload(filePath);
    } catch (err: any) {
      showAlert(err.message, 1.5);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} radius="xl" alt="Avatar" size={props.size} />
      ) : (
        <div
          style={{
            height: props.size,
            width: props.size,
            backgroundColor: "gray",
            borderRadius: "100%",
          }}
        />
      )}
      <div>
        <label htmlFor="single">{uploading ? "Uploading..." : "Upload"}</label>
        <br />
        <input
          type="file"
          name="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
      <p>{alert}</p>
    </div>
  );
};

export default Avatar;
