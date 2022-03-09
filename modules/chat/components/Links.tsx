import { NextPage } from "next";
import {
  Navbar,
  NavbarProps,
  TextInput,
  Button,
  Text,
  Loader,
} from "@mantine/core";
import { useState, useEffect, FormEvent } from "react";
import { supabase } from "../../../utils/db/supabaseClient";
import { Connections } from "../interfaces/Connections";
import { NameObject } from "../interfaces/NameObject";
import ConnectionUI from "./ConnectionUI";

const Links: NextPage<any> = (props: Omit<NavbarProps, "children">) => {
  const [user, setUser] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState(""); // TODO read the user email
  const [autocomplete, setAutocomplete] = useState<any[]>([]);
  const [added, setAdded] = useState(false);
  const [connections, setConnections] = useState<any | null>(null);
  const [names, setNames] = useState<any>([]);
  const [nameId, setNameId] = useState("");

  useEffect(() => {
    async function map(arr: any, callback: any) {
      return await Promise.all(
        arr.map(async (item: any) => await callback(item))
      );
    }
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

    const fetchNames = async (item: Connections) => {
      const id = item.connection_to;

      const { data, error }: any = await supabase
        .from("profiles")
        .select()
        .eq("id", id);

      const name = data[0].first_name + " " + data[0].last_name;
      const email = data[0].email;

      return { name, id, email };
    };

    const fetchConnections = async () => {
      if (!connections) {
        const { data, error } = await supabase
          .from("connections")
          .select("to_email, connection_to");

        if (!error) setConnections(data);
        else console.log(error);
      }

      let result: NameObject | Promise<{ name: string; id: string }[]> | null =
        null;

      if (connections) {
        result = Promise.all(
          connections!.map((item: Connections) => fetchNames(item))
        );
      }

      return result;
    };

    fetchData();
    fetchConnections().then((res: any) => {
      if (res) {
        setNames(res);
      }
    });
  }, [user, userId, connections]);

  const setPerson = (value: string, id: string, email: string) => {
    setUser(value);
    setUserId(id);
    setUserEmail(email);
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
                    setPerson(
                      item.first_name + " " + item.last_name,
                      item.id,
                      item.email
                    );
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
