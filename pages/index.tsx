import styled from "@emotion/styled";
import { Button, Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { css, useTheme } from "@emotion/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import CustomerOrder from "../components/customer";

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

      <CustomerOrder />
    </div>
  );
}
