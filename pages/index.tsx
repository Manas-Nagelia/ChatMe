import type { NextPage } from "next";
import HomePage from "../components/Home";
import Account from "../modules/auth/components/Account";
import { AccountProps } from "../modules/auth/interfaces/AccountProps";

const Home: NextPage<AccountProps> = (props) => {
  return (
    <div>
      {!props.session ? (
        <HomePage />
      ) : (
        <Account key={props.session.user!.id} session={props.session} />
      )}
    </div>
  );
};

export default Home;
