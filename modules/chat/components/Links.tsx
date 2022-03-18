import { NextPage } from "next";
import { Navbar, NavbarProps, TextInput, Button, Text } from "@mantine/core";
import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import ConnectionUI from "./ConnectionUI";
import { Connections } from "../interfaces/Connections";

const Links: NextPage<any> = (props: Omit<NavbarProps, "children">) => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [autocomplete, setAutocomplete] = useState<any[]>([]);
  const [added, setAdded] = useState(false);
  const [connections, setConnections] = useState<any | null>(null);
  const [names, setNames] = useState<any[]>([]);

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

    const fetchNamesFromConnections = async (connectionData: any) => {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq(
          "id",
          connectionData.map((item: any) => item.connection_to)
        );

      if (!error)
        data!.map((name: any) => {
          // setNames((prevState: any) => [...prevState, name])
          const newNames = [...names, name];
          setNames(newNames);
        });
      else console.log(error);

      return data;
    };

    const cacheConnections = async (data: any[] | null) => {
      for (const connection of data!) {
        const res = await fetch("/api/connections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            connection_from: connection.connection_from,
            to_email: connection.to_email,
            connection_to: connection.connection_to,
          }),
        });

        if (res.status === 200) {
          return true;
        } else {
          return false;
        }
      }
    };

    const fetchConnections = async () => {
      if (!connections) {
        const q = supabase.auth.user()!.id;

        const params = new URLSearchParams({ q });

        const res = await fetch(`/api/search?${params}`);
        const resData = await res.json();

        if (resData.connections.length > 0) {
          await fetchNamesFromConnections(resData.connections);
          setConnections(res);
        } else {
          const { data, error } = await supabase.from("connections").select();
          if (!error && data && data.length > 0) {
            const result = await fetchNamesFromConnections(data);
            setConnections(result);

            const cacheResult = cacheConnections(data);
            if (!cacheResult) console.log("Error caching connections");
          }
        }
      }
    };

    fetchData();
    fetchConnections();
  }, [user, userId, connections]);

  const setPerson = (value: string, id: string) => {
    setUser(value);
    setUserId(id);
    setAdded(true);
  };

  // TODO Add a notification if successful
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
    <Navbar {...props}>
      <Navbar.Section>
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            addUser();
            setUser("");
          }}
        >
          <TextInput
            placeholder="Name"
            label="Add a user"
            onChange={(e) => setUser(e.target.value)}
            value={user}
          />
          {added && (
            <Button type="submit" mt={5}>
              Add user
            </Button>
          )}
        </form>
        {user != "" && autocomplete.length === 0 && (
          <Text size="md" mt="xs">
            No user found with that name
          </Text>
        )}
        {autocomplete && autocomplete.length > 0 && (
          <ul>
            {autocomplete.map((item: any) => (
              <li key={item.id}>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={(e: FormEvent) => {
                    e.preventDefault();
                    setPerson(item.first_name + " " + item.last_name, item.id);
                  }}
                >
                  {item.first_name + " " + item.last_name}
                </Text>
              </li>
            ))}
          </ul>
        )}
      </Navbar.Section>
      {names.length !== 0 && <ConnectionUI names={names} />}
    </Navbar>
  );
};

export default Links;
