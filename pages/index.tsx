import type { NextPage } from "next";
import HomePage from "../components/Home";
import { SessionProps } from "../interfaces/SessionProps";
import Chats from "../components/chats";

const Home: NextPage<SessionProps> = (props) => {
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
