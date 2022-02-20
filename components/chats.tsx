import type { NextPage } from "next";
import { AccountProps } from "../modules/auth/interfaces/AccountProps";
import useRouteGuard from "../utils/guards/useRouteGuard";

const Chats: NextPage<AccountProps> = (props) => {
  const redirecting = useRouteGuard(props.session);

  if (redirecting) {
    return (
      <div>
        <p>Redirecting...</p>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Your chats</h1>
      </div>
    );
  }
};

export default Chats;
