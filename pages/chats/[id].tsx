import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SessionProps } from "../../interfaces/SessionProps";
import Sidebar from "../../modules/chat/components/Sidebar";
import { supabase } from "../../utils/db/supabaseClient";
import useRouteGuard from "../../utils/guards/useRouteGuard";
import Head from "next/head";

const Chats: NextPage<SessionProps> = (props) => {
  const [name, setName] = useState("");
  useRouteGuard(props.session);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchName = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id)
        .single();

        if (data && !error) setName(data.first_name + " " + data.last_name);
        else if (error) console.log(error);
    };

    fetchName();
  }, [id]);

  return (
    <div>
      <Head>
        <title>ChatMe - {name}</title>
      </Head>
      <Sidebar />
    </div>
  );
};

export default Chats;
