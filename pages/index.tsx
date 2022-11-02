import styled from "@emotion/styled";
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { css, useTheme } from "@emotion/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const HomePageBanner = styled(Box)(({ theme }) => {
  return {
    backgroundImage: `url("/spin_stone_banner.png")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.background.paper,
    height: "250px",
    width: "100%",
  };
}) as typeof Box;


export default function Home() {
  let theme = useTheme();

  return (
    <div>
      <Head>
        <title>spinstone</title>
        <meta name="description" content="its pizza" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePageBanner />

      <Box
        sx={{
          backgroundColor: theme.palette.grey[900],
          color: "white",
        }}
      >
        <Container
          sx={{
            padding: theme.spacing(10),
          }}
        >
          <Typography variant="h4">
            Here at Spin N' Stone, we make pizza and sell drinks. If that's
            what you like then come on by! If not.. well too bad that's all
            we've got.
          </Typography>
        </Container>
      </Box>
    </div>
  );
}
