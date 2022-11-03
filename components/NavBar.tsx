import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import Grid2 from "@mui/material/Unstable_Grid2";
import Image from "next/image";
import { useTheme } from "@mui/system";
import { CustomTheme } from "@mui/material/styles";
import { FormControl, Input, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const pages: { [key: string]: string } = {
  home: "/",
  server: "/server",
  customer: "/customer",
  manager: "/manager",
};

function ResponsiveAppBar() {
  const router = useRouter();
  const theme = useTheme<CustomTheme>();
  // https://mui.com/material-ui/react-app-bar/
  return (
    <AppBar
      position="static"
      sx={{
        borderBottom: `1px solid ${theme.palette.borderColor}`,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ paddingTop: theme.spacing(1), paddingBottom: theme.spacing(1) }}
      >
        <Toolbar disableGutters>
          <Grid2
            container
            alignItems="center"
            spacing={2}
            sx={{ width: "100%" }}
          >
            <Grid2>
              <Image src="/logo.jpg" alt="logo" width={100} height={100} />
            </Grid2>
          </Grid2>
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
