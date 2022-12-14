import styled from "@emotion/styled";
import { Container, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import Head from "next/head";

/**
 * The css theme of the homepage banner
 */
const HomePageBanner = styled(Box)(({ theme }) => {
  return {
    backgroundImage: `url("/spin_stone_banner_inverted.png")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "250px",
    width: "100%",
  };
}) as typeof Box;

const dayStyle = {
  width: "10%",
  minWidth: "100px",
  display: "inline-block",
  boxSizing: "border-box" as "border-box",
  textAlign: "right" as "right",
  color: "white",
};
/**
 * The css theme of the hours of operation box
 */
const hoursStyle = {
  width: "80%",
  maxWidth: "calc(90% - 100px)",
  paddingLeft: "10px",
  display: "inline-block",
  boxSizing: "border-box" as "border-box",
  textAlign: "left" as "left",
  color: "white",
};

/**
 * This is the setup of the homepage display. It contains the title, logo, hours of operation, and implements google maps.
 */
export default function Home() {
  let theme = useTheme();

  return (
    <div>
      <Head>
        <title>Spin &apos;N Stone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomePageBanner />

      <Box>
        <Container
          sx={{
            padding: "10px"
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Hours of Operation
          </Typography>
          <div style={dayStyle}>SUNDAY:</div>{" "}
          <div style={hoursStyle}> closed</div>
          <div style={dayStyle}>MONDAY:</div>{" "}
          <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>TUESDAY:</div>{" "}
          <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>WEDNESDAY:</div>{" "}
          <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>THURSDAY:</div>{" "}
          <div style={hoursStyle}> 10:00 AM - 4:00 PM</div>
          <div style={dayStyle}>FRIDAY:</div>{" "}
          <div style={hoursStyle}> 10:00 AM - 3:00 PM</div>
          <div style={dayStyle}>SATURDAY:</div>{" "}
          <div style={hoursStyle}> closed</div>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.7667023268996!2d-96.34363518513555!3d30.612342998476418!
          2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864683afcd3de05f%3A0xf78e5c7be3131946!2sSpin%20&#39;N%20Stone%20Pizza%20-%20MSC!
          5e0!3m2!1sen!2sus!4v1668567572807!5m2!1sen!2sus"
            width="100%"
            height="400"
            loading="lazy"
            style={{ paddingTop: "40px", paddingBottom: "30px", filter: "invert(100%)" }}
          ></iframe>
        </Container>
      </Box>
    </div>
  );
}
