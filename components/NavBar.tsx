import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";

const pages: { [key: string]: string } = {
  home: "/",
  customer: "/customer",
};

function ResponsiveAppBar() {
  const router = useRouter();
  // https://mui.com/material-ui/react-app-bar/
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
            {Object.entries(pages).map(([name, route]) => (
              <Button
                color="inherit"
                key={name}
                onClick={() => router.push(route)}
              >
                {name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
