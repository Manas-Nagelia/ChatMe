import type { NextPage } from "next";
import HomePage from "../components/Home";
import { AccountProps } from "../modules/auth/interfaces/AccountProps";
import Chats from "../components/chats";

const Home: NextPage<AccountProps> = (props) => {
  return (
    <div>
      {!props.session ? (
        <HomePage />
      ) : (
        <Chats session={props.session} />
      )}
    </div>
  );
};

export default Home;
