import type { NextPage } from "next";
import { useState } from "react";
import { SessionProps } from "../interfaces/SessionProps";
import { useRealtime } from "react-supabase";
import Loading from "./Loading";

const Chats: NextPage<SessionProps> = (props) => {
  const [loading, setLoading] = useState(true);

  const [{ data, error }] = useRealtime("messages", {
    select: {
      columns: "id,message",
    },
  });

  if (data && loading) setLoading(false);

  if (error) console.log(error);
  return (
    <div>
      <h1>Your chats</h1>
      {loading && <Loading />}
      {data && data.map((message) => <p key={message.id}>{message.message}</p>)}
    </div>
  );
};

export default Chats;
