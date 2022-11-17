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
    backgroundColor: theme.palette.grey[100],
    height: "250px",
    width: "100%",
  };
}) as typeof Box;

const dayStyle = {
  width: '11%',
  display: 'inline-block',
  boxSizing: 'border-box' as 'border-box',
  textAlign: 'right' as 'right'
};

const hoursStyle = {
  width: '80%',
  paddingLeft: '10px',
  display: 'inline-block',
  boxSizing: 'border-box' as 'border-box',
  textAlign: 'left' as 'left'
};

export default function Home() {
  let theme = useTheme();

  return (
    <div>
      <Head>
        <title>Spin 'N Stone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePageBanner />

      <Box
        sx={{
          backgroundColor: theme.palette.grey[100],
        }}
      >
        <Container
          sx={{
            padding: theme.spacing(10),
          }}
        >
          <Typography variant="h6">Hours of Operation</Typography>
          <div style={dayStyle}>SUNDAY:</div>     <div style={hoursStyle}> closed</div>  
          <div style={dayStyle}>MONDAY:</div>     <div style={hoursStyle}> 10:00 AM - 4:00 PM</div> 
          <div style={dayStyle}>TUESDAY:</div>    <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>WEDNESDAY:</div>  <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>THURSDAY:</div>   <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>FRIDAY:</div>     <div style={hoursStyle}> 10:00 AM - 3:00 PM</div>
          <div style={dayStyle}>SATURDAY:</div>   <div style={hoursStyle}> closed</div> 
        </Container>
      </Box>
    </div>
  );
}