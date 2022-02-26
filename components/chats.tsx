import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRealtime } from "react-supabase";
import Loading from "./Loading";
import { supabase } from "../utils/db/supabaseClient";

const Chats: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [{ data, error }] = useRealtime("messages", {
    select: {
      columns: "id,message",
    },
  });

  if (data && loading) setLoading(false);

  if (error) console.log(error);

  const fetchData = async () => {
    const { data, error } = await supabase.rpc("search_last_name", {
      search_query: "Nage",
    });

    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sendMessage = async () => {
    const userId = supabase.auth.user().id;
    const { data, error } = await supabase.from("messages").insert([
      {
        msg_from: userId,
        message: message,
        msg_to: "87d2b27c-14ae-4219-ab3f-b7a3a981cdb9",
      },
    ]);

    if (error) console.log(error);
    else setMessage("");
  };

  return (
    <div>
      <h1>Your chats</h1>
      {loading && <Loading />}
      {data && data.map((message) => <p key={message.id}>{message.message}</p>)}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        autoComplete="off"
      >
        <label htmlFor="message">Type your message: </label>
        <input
          type="text"
          name="message"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chats;
