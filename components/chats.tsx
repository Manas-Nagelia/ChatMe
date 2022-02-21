import type { NextPage } from "next";
import { AccountProps } from "../modules/auth/interfaces/AccountProps";

const Chats: NextPage<AccountProps> = (props) => {
  return (
    <div>
      <h1>Your chats</h1>
    </div>
  );
};

export default Chats;
