import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  AppBar,
  Container,
  CustomTheme,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import MenuIcon from "@mui/icons-material/Menu";
import eventStream, { events } from "../models/events";
import { filter } from "rxjs";
import Link from "next/link";

const pages: { [key: string]: string } = {
  home: "/",
  server: "/server",
  customer: "/customer",
  manager: "/manager",
};

export function TemporaryDrawer(): JSX.Element {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    eventStream
      .pipe<events>(
        filter((event) =>
          [events.OPEN_DRAWER, events.CLOSE_DRAWER].includes(event)
        )
      )
      .subscribe((event) => {
        setState(event === events.OPEN_DRAWER);
      });
  });

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState(open);
    };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {Object.entries(pages).map(([name, route], index) => (
          <ListItem key={name} disablePadding>
            <ListItemButton>
              <Link href={route}>
                <ListItemText primary={name} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer anchor={"right"} open={state} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

export default function ResponsiveAppBar() {
  const router = useRouter();
  const theme = useTheme<CustomTheme>();
  const [mobile, setIsMobile] = React.useState(
    useMediaQuery(theme.breakpoints.down("xs"))
  );

  function handleResize() {
    if (
      window.matchMedia(theme.breakpoints.up("sm").replace("@media ", ""))
        .matches
    ) {
      if (mobile) {
        eventStream.next(events.CLOSE_DRAWER);
        setIsMobile(false);
      }
    } else {
      if (!mobile) {
        setIsMobile(true);
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  // https://mui.com/material-ui/react-app-bar/
  return (
    <>
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
            <Box
              sx={{
                flexGrow: 1,
                display: mobile ? "none" : "flex",
              }}
            >
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
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => eventStream.next(events.OPEN_DRAWER)}
              sx={{ display: mobile ? "block" : "none" }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
