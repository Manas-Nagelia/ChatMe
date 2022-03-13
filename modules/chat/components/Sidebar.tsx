import { NextPage } from "next";
import {
  AppShell,
  Button,
  Textarea,
  Loader,
  Center,
  Text,
} from "@mantine/core";
import Links from "./Links";
import MainHeader from "./Header";
import { useState } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import { useRealtime } from "react-supabase";
import { useRouter } from "next/router";
import { Message } from "../interfaces/Message";

const Sidebar: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [{ data, error }] = useRealtime("messages", {
    select: {
      columns: "id,msg_from,message,msg_to,name",
    },
  });

  if (data && loading) setLoading(false);

  if (error) console.log(error);

  const sendMessage = async () => {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select()
      .eq("id", supabase.auth.user()!.id)
      .single();
    const { data, error } = await supabase.from("messages").insert([
      {
        msg_from: supabase.auth.user()!.id,
        message: message,
        msg_to: id, // TODO get this value based on who you're talking to
        name: profilesData!.first_name + " " + profilesData!.last_name,
      },
    ]);

    if (error) console.log(error);
    else setMessage("");
  };

  let messageData: any = null;
  if (data && id) {
    messageData = data.filter(
      (message) =>
        (message.msg_to === id &&
          message.msg_from === supabase.auth.user()!.id) ||
        (message.msg_from === id && message.msg_to === supabase.auth.user()!.id)
    );
    console.log(messageData);
  }

  if (!loading) {
    return (
      <AppShell
        padding="md"
        navbar={<Links width={{ base: 300 }} height={500} padding="md" />}
        header={<MainHeader height={70} padding="xs" />}
      >
        {messageData ? (
          messageData.map((msg: Message) => (
            <div key={msg.id}>
              <Text mb="md">
                <b>{msg.name}</b>: {msg.message}
              </Text>
            </div>
          ))
        ) : (
          <Text mb="md">Select a person to chat to</Text>
        )}
        {messageData && (
          <form
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
          </form>
        )}
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
