import { NextPage } from "next";
import {
  AppShell,
  Button,
  Textarea,
  Loader,
  Center,
  Text,
  TextInput,
  Paper,
  createStyles,
  MantineTheme,
  ScrollArea,
  Avatar,
  Title,
  Menu,
  Group,
} from "@mantine/core";
import Links from "./Sidebar";
import MainHeader from "./Header";
import { useState, useCallback, useEffect } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import { useRealtime } from "react-supabase";
import { useRouter } from "next/router";
import { Message } from "../interfaces/Message";
import UserAvatar from "./UserAvatar";
import { Profile } from "../../auth/interfaces/Profile";
import { IoMdTrash } from "react-icons/io";

const useStyles = createStyles((theme: MantineTheme) => ({
  chatContainer: {
    position: "relative",
    backgroundColor: theme.colors.brand[6],
    padding: theme.spacing.xs,
    borderRadius: theme.spacing.lg,
    maxWidth: "30%",
    color: "white",
  },
  chatArrowContainerYou: {
    position: "absolute",
    bottom: -25,
    right: -36,
    backgroundColor: "transparent",
    backgroundImage: "url(/Arrow.svg)",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 50,
  },
  chatArrowContainerMe: {
    position: "absolute",
    bottom: -25,
    right: 293,
    backgroundColor: "transparent",
    backgroundImage: "url(/Arrow.svg)",
    transform: "scaleX(-1)",
    WebkitTransform: "scaleX(-1)",
    backgroundRepeat: "no-repeat",
    width: 70,
    height: 50,
  },
  chatArrow: {
    userSelect: "none",
    MozUserSelect: "none",
    webkitUserSelect: "none",
    msUserSelect: "none",
  },
  avatarYou: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: -35,
    right: -35,
  },
  avatarMe: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: -35,
    right: 335,
  },
}));
const Chats: NextPage = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", id)
          .single();

        setUser(data);
      }
    };

    fetchUser();
  }, [id]);

  let userID: string;

  if (supabase.auth.user()) {
    userID = supabase.auth.user()!.id;
  }

  const { classes } = useStyles();

  const bottom = useCallback((node: any) => {
    if (node !== null) node.scrollIntoView();
  }, []);

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
      .eq("id", userID)
      .single();
    const { data, error } = await supabase.from("messages").insert([
      {
        msg_from: userID,
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
        (message.msg_to === id && message.msg_from === userID) ||
        (message.msg_from === id && message.msg_to === userID)
    );
  }

  const submit = (e: any) => {
    e.preventDefault();
    sendMessage();
  };

  if (!loading) {
    return (
      <AppShell
        padding="md"
        navbar={<Links width={{ base: 300 }} height={500} padding="md" />}
        header={<MainHeader height={70} padding="xs" />}
      >
        {user && (
          <Paper
            mx={-16}
            mr={-25}
            sx={{
              position: "sticky",
              borderBottom: "1px solid #DEE2E6",
              paddingLeft: "2%",
              paddingBottom: "1%",
            }}
          >
            <Group spacing={5} align="center">
              <Title>{user && user.first_name + " " + user.last_name}</Title>
              <Menu>
                <Menu.Item icon={<IoMdTrash />} color="red">Delete contact</Menu.Item>
              </Menu>
            </Group>
          </Paper>
        )}
        {messageData && messageData.length === 0 && (
          <Text>No messages, yet!</Text>
        )}
        {messageData && messageData.length > 0 && (
          <ScrollArea style={{ height: 410 }}>
            {messageData &&
              messageData.length > 0 &&
              messageData.map((msg: Message) => (
                <>
                  <Paper
                    key={msg.id}
                    className={classes.chatContainer}
                    mt="md"
                    ml={msg.msg_from == userID ? "auto" : 50}
                    mr={60}
                  >
                    <Text mb="md" align="left" sx={{ wordWrap: "break-word" }}>
                      {msg.message}
                    </Text>
                    <Paper
                      className={
                        msg.msg_to == userID
                          ? classes.chatArrowContainerMe
                          : classes.chatArrowContainerYou
                      }
                    ></Paper>
                    <Paper
                      className={
                        msg.msg_to == userID
                          ? classes.avatarMe
                          : classes.avatarYou
                      }
                    >
                      {msg.msg_from == userID ? (
                        <UserAvatar size={30} />
                      ) : (
                        <UserAvatar size={30} id={msg.msg_from} />
                      )}
                    </Paper>
                  </Paper>
                  <div ref={bottom}></div>
                </>
              ))}
          </ScrollArea>
        )}
        {!messageData && <p>Choose a person to chat to</p>}
        {messageData && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            autoComplete="off"
            style={{ marginTop: "1.5em" }}
          >
            <Textarea
              placeholder="Your message"
              label="Message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              autosize
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey
                  ? message.trimEnd() !== "" && submit(e)
                  : null
              }
            />
            <Button
              type="submit"
              mt="xs"
              disabled={message.trimEnd() == "" ? true : false}
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
      <AppShell
        padding="md"
        navbar={<Links width={{ base: 300 }} height={500} padding="md" />}
        header={<MainHeader height={70} padding="xs" />}
      >
        <Loader />
      </AppShell>
    );
  }
};

export default Chats;
