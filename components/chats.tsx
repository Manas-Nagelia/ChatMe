import type { NextPage } from "next";
import { SessionProps } from "../interfaces/SessionProps";

const Chats: NextPage<SessionProps> = (props) => {
  return (
    <div>
      <h1>Your chats</h1>
    </div>
  );
};

export default Chats;
