import type { NextPage } from "next";
import HomePage from "../components/Home";
import { SessionProps } from "../interfaces/SessionProps";
import Chats from "../components/Chats";
import Head from "next/head";

const Home: NextPage<SessionProps> = (props) => {
  return (
    <div>
      <Head>
        <title>{!props.session ? "ChatMe" : "Your chat"}</title>
      </Head>
      {!props.session ? <HomePage /> : <Chats />}
    </div>
  );
};

export default Home;
