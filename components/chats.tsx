import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useRealtime } from "react-supabase";
import Loading from "./Loading";
import { supabase } from "../utils/db/supabaseClient";
import Sidebar from "./Sidebar";

const Chats: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [autocomplete, setAutocomplete] = useState<any[]>([]);
  const [added, setAdded] = useState(false);

  const [{ data, error }] = useRealtime("messages", {
    select: {
      columns: "id,message",
    },
  });

  if (data && loading) setLoading(false);

  if (error) console.log(error);

  // auto
  useEffect(() => {
    async function filter(arr: any, callback: any) {
      const fail = Symbol();
      return (
        await Promise.all(
          arr.map(async (item: any) => ((await callback(item)) ? item : fail))
        )
      ).filter((i) => i !== fail);
    }

    const fetchData = async () => {
      const { data, error } = await supabase.rpc("search_first_name", {
        search_query: user,
      });

      const newData = data!.filter((user) => user.id != supabase.auth.user()!.id);

      const filteredData = await filter(newData, async (user: any) => {
        const { data } = await supabase
          .from("connections")
          .select()
          .eq("connection_to", user.id);
        return data!.length === 0;
      });

      if (newData.length === 0) {
        const { data, error } = await supabase.rpc("search_last_name", {
          search_query: user,
        });

        const newData = data!.filter(
          (user) => user.id != supabase.auth.user()!.id
        );

        const filteredData = await filter(newData, async (user: any) => {
          const { data } = await supabase
            .from("connections")
            .select()
            .eq("connection_to", user.id);
          return data!.length === 0;
        });

        if (!error) setAutocomplete(filteredData);
        else console.log(error);
      } else {
        if (!error) setAutocomplete(filteredData);
        else console.log(error);
      }
    };

    fetchData();
  }, [user, userId]);

  const sendMessage = async () => {
    const { data, error } = await supabase.from("messages").insert([
      {
        msg_from: supabase.auth.user()!.id,
        message: message,
        msg_to: userId,
      },
    ]);

    if (error) console.log(error);
    else setMessage("");
  };

  // auto
  const setPerson = (value: string, id: string, email: string) => {
    setUser(value);
    setUserId(id);
    setUserEmail(email);
    setAdded(true);
  };

  // auto
  const addUser = async () => {
    const { data: selectData, error: selectError } = await supabase
      .from("connections")
      .select()
      .eq("connection_to", userId);

    if (selectData!.length != 0) {
      // TODO - add error message
      console.log("User already exists");
    } else {
      const { data: emailData, error: emailError } = await supabase
        .from("profiles")
        .select()
        .eq("id", userId);

      if (!emailError) {
        const { data, error } = await supabase.from("connections").insert([
          {
            connection_from: supabase.auth.user()!.id,
            to_email: emailData![0].email,
            connection_to: userId,
          },
        ]);

        if (error) console.log(error);
        else setAdded(false);
      }
    }
  };

  return (
    <div>
      <Sidebar />
      {loading && <Loading />}
      <form
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          addUser();
          setUser("");
        }}
      >
        <label htmlFor="user">User: </label>
        <input
          type="text"
          name="user"
          placeholder="Who do you want to chat with?"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
        {added && <input type="submit" value="Add" />}
      </form>
      {user != "" && autocomplete.length === 0 && (
        <p>No user found with that name</p>
      )}
      {autocomplete && autocomplete.length > 0 && (
        <ul>
          {autocomplete.map((item: any) => (
            <li key={item.id}>
              <p
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  e.preventDefault();
                  setPerson(
                    item.first_name + " " + item.last_name,
                    item.id,
                    item.email
                  );
                }}
              >
                {item.first_name + " " + item.last_name}
              </p>
            </li>
          ))}
        </ul>
      )}
      <hr />
      {data && data.map((message) => <p key={message.id}>{message.message}</p>)}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        autoComplete="off"
      >
        <label htmlFor="message">Type your message: </label>
        <input
          type="text"
          name="message"
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chats;
