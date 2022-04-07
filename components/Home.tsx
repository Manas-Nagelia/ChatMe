import { createStyles, Paper, Title, Text, Button, Group, Modal } from "@mantine/core";
import type { NextPage } from "next";
import TextTransition from "react-text-transition";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import HeroImage from "../public/Hero_Image.svg";
import Image from "next/image";

const useStyles = createStyles((theme) => ({
  changingText: {
    border: "0.5px solid black",
    borderRadius: "10px",
    padding: "1px 6px 5px",
    color: theme.colors.brand[6],
  },
  desc: {
    fontWeight: 400,
    width: "350px",
  },
  subHeading: {
    textTransform: "uppercase",
    letterSpacing: "0.35em",
    color: theme.colors.dark[2],
  },
  heroImage: {
    objectFit: "cover",
  },
  heroImageContainer: {
    position: "relative",
    top: "5em",
    width: "90%",

    "@media (max-width: 1000px)": {
      top: "6em",
      left: "3em",
      width: "90%",
    },

    "@media (max-width: 800px)": {
      top: "2em",
      left: "-50%",
      width: "20em",
    },
  },
  heroImageFullContainer: {
    position: "absolute",
    top: "5.5%",
    left: "55%",
    backgroundColor: "transparent",

    "@media (max-width: 800px)": {
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
    },
  },
  heroContent: {
    backgroundColor: "transparent",
    position: "absolute",
    top: "28%",

    "@media (max-width: 800px)": {
      top: "60%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
    },
  },
  group: {
    marginLeft: 150,
    marginRight: 150,

    "@media (max-width: 800px)": {
      marginLeft: "10%",
      marginRight: "10%",
      flexDirection: "column",
      alignItems: "center",
    },
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
    <>
      <Group className={classes.group} spacing="xl">
        <Paper className={classes.heroContent}>
          <style jsx global>{`
            body {
              background-image: url("/StripPatterns.svg");
              background-size: 75%;
              background-repeat: no-repeat;
            }

            @media (max-width: 950px) {
              body {
                background-size: 0%;
              }
            }
          `}</style>
          <Text weight="bold" size="sm" className={classes.subHeading}>
            The Future of Chatting
          </Text>
          <Title>
            Chatting never been <br />
            this{" "}
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
          <Paper sx={{ textAlign: "right" }}></Paper>
        </Paper>
        <Paper className={classes.heroImageFullContainer}>
          <div className={classes.heroImageContainer}>
            <Image
              src={HeroImage}
              alt="A hero image depicting a globe and people chatting"
              className={classes.heroImage}
            />
          </div>
        </Paper>
      </Group> 
    </>
  );
};

export default HomePage;
