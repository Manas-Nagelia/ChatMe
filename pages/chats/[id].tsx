import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProps } from "../../interfaces/SessionProps";
import Sidebar from "../../modules/chat/components/Chats";
import { supabase } from "../../utils/db/supabaseClient";
import useRouteGuard from "../../utils/guards/useRouteGuard";
import Head from "next/head";
import { Profile } from "../../modules/auth/interfaces/Profile";

const Chats: NextPage<SessionProps> = (props) => {
  const [name, setName] = useState("");
  useRouteGuard(props.session);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const getProfile = async () => {
      if (id) {
        const { data: connectionData, error: connectionError } = await supabase
          .from("connections")
          .select()
          .eq("connection_to", id)
          .single();

        if (connectionData) {
          // setLoading(true);
          const user = supabase.auth.user();

          let { data, error, status } = await supabase
            .from("profiles")
            .select(`first_name, last_name, avatar_url`)
            .eq("id", props.session.user?.id)
            .single();

          const queriedData: Profile = data;

          if (!queriedData) router.push("/getStarted");
        } else {
          router.push("/");
        }
      }
    };

    const fetchName = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id)
        .single();

      if (data && !error) setName(data.first_name + " " + data.last_name);
      else if (error) console.log(error);
    };

    if (props.session) getProfile();
    if (id) fetchName();
  }, [id, router, props.session]);

  return (
    <div>
      <Head>
        {name ? (
          <title>ChatMe - {name}</title>
        ) : (
          <title>ChatMe - Loading</title>
        )}
      </Head>
      <Sidebar />
    </div>
  );
};

export default Chats;
