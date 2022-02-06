import { NextPage } from "next";
import { useState, useEffect } from "react";
import checkIfEmpty from "../../../utils/services/checkIfEmpty";
import { supabase } from "../utils/supabaseClient";

const Auth: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");

  const showAlert = (message: string, seconds: number) => {
    setAlert(message);

    setTimeout(() => {
      setAlert("");
    }, seconds * 1000);
  };

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      // TODO: Have an option to disclose the message  
      setAlert("Check your email for the login link!");
    } catch (err: any) {
      if (checkIfEmpty(email))
        showAlert("Please provide a valid email address", 1.25);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Sign in via magic link to chat:</h1>
      <p>
        Just enter in your email to get a magic link sent to your email, that
        signs you in instantly!
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(email);
        }}
      >
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button disabled={loading} type="submit">
          <span>{loading ? "Loading..." : "Send email"}</span>
        </button>
      </form>
      <p>{!loading && alert}</p>
    </div>
  );
};

export default Auth;
