import { NextPage } from "next";
import { AppShell, Button, Textarea, Loader, Center, Text } from "@mantine/core";
import Links from "./Links";
import MainHeader from "./Header";
import { useState } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import { useRealtime } from "react-supabase";
import { useRouter } from "next/router";

const Sidebar: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  const [{ data, error }] = useRealtime("messages", {
    select: {
      columns: "id,message",
    },
  });

  if (data && loading) setLoading(false);

  if (error) console.log(error);

  const sendMessage = async () => {
    const { data, error } = await supabase.from("messages").insert([
      {
        msg_from: supabase.auth.user()!.id,
        message: message,
        msg_to: userId, // TODO get this value based on who you're talking to
      },
    ]);

    if (error) console.log(error);
    else setMessage("");
  };

  let messageData = null;
  if (data && id) {
    messageData = data.filter((message) => message.msg_from === id);
  }

  console.log(id);

  if (!loading) {
    return (
      <AppShell
        padding="md"
        navbar={<Links width={{ base: 300 }} height={500} padding="md" />}
        header={<MainHeader height={70} padding="xs" />}
      >
        {messageData ?
          messageData.map((message) => (
            <Text key={message.id}>{message.message}</Text>
          )): <Text mb="md">Select a person to chat to</Text>}
        {messageData && <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          autoComplete="off"
        >
          <Textarea
            placeholder="Message"
            label="Message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            type="submit"
            mt="xs"
            disabled={message === "" ? true : false}
          >
            Send
          </Button>
        </form>}
      </AppShell>
    );
  } else {
    return (
      // TODO Make a skeleton here
      <Center>
        <Loader />
      </Center>
    );
  }
};

export default Sidebar;
