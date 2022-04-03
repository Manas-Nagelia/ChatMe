import { createStyles, Paper, Title, Text, Button } from "@mantine/core";
import type { NextPage } from "next";
import TextTransition from "react-text-transition";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StripPatterns from "../public/StripPatterns.svg";

const useStyles = createStyles((theme) => ({
  changingText: {
    border: "0.5px solid black",
    borderRadius: "10px",
    padding: "1px 6px 5px",
    color: theme.colors.brand[6],
  },
  desc: {
    fontWeight: 400,
    width: "300px",
  },
}));
const HomePage: NextPage = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const adjectives = [
    "easy",
    "powerful",
    "fun",
    "fast",
    "simple",
    "clean",
    "beautiful",
  ];
  const [counter, setCounter] = useState(0);
  const [secondsShown, setSecondsShown] = useState(0);
  const [currentAdjective, setCurrentAdjective] = useState(adjectives[counter]);

  useEffect(() => {
    setSecondsShown(3);

    const interval = setInterval(() => {
      if (counter < adjectives.length - 1) {
        setCounter(counter + 1);
      } else setCounter(0);
      setCurrentAdjective(adjectives[counter]);
    }, secondsShown * 1000);
    return () => clearInterval(interval);
  }, [counter, currentAdjective]);

  return (
    <Paper mt={50} mx={80} sx={{ backgroundColor: "transparent" }}>
      <style jsx global>{`
        body {
          background-image: url("/StripPatterns.svg");
          background-size: 75%;
          background-repeat: no-repeat;
        }

        @media (max-width: 700px) {
          body {
            background-size: 0%;
          }
        }
      `}</style>
      <Title>
        Chatting never <br />
        been this{" "}
        <span className={classes.changingText}>
          <TextTransition
            text={currentAdjective}
            direction="up"
            inline={true}
          />
        </span>
      </Title>
      <Text mt="md" className={classes.desc}>
        Chatting should be easy and fun, not complicated and messy.
      </Text>
      <Button
        sx={(theme) => ({
          boxShadow: "2px 4px 15px rgba(0, 0, 0, 0.25)",
        })}
        onClick={() => router.push("/auth")}
        mt="xl"
      >
        Get Started
      </Button>
    </Paper>
  );
};

export default HomePage;
