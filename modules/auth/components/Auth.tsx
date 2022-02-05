import { NextPage } from "next";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const Auth: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState("");

  const handleLogin = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn({ email });
      if (error) throw error;
      setAlert("Check your email for the login link!");
    } catch (err: any) {
      if (err.status)
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
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          handleLogin(email);
        }}
        disabled={loading}
      >
        <span>{loading ? "Loading..." : "Send email"}</span>
      </button>
      <p>{!loading && alert}</p>
    </div>
  );
};

export default Auth;
