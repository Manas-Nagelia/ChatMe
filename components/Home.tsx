import type { NextPage } from "next";
import Link from "next/link";

const HomePage: NextPage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <Link href="/auth">
        <a>Get started</a>
      </Link>
    </div>
  );
};

export default HomePage;
