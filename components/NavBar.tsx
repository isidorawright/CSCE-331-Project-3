import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
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
import Link from "next/link";
import { Dispatch, RootState } from "../models/store";
import { useDispatch, useSelector } from "react-redux";
import { UserRole } from "../models/user";
import Image from "next/image";

const pages: { [key: string]: string } = {
  home: "/",
  order: "/order",
  manage: "/manager",
  reports: "/report",
};

export function TemporaryDrawer(): JSX.Element {
  const drawerState = useSelector((state: RootState) => state.drawer);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const theme = useTheme<CustomTheme>();

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      dispatch.drawer.open();
    };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ padding: theme.spacing(2) }}
    >
      <List>
        {[
          ...Object.entries(pages).map(([name, route], index) => {
            if (userState.user.role != UserRole.MANAGER && name == "manage") {
              return null;
            }
            if (userState.user.role != UserRole.MANAGER && name == "reports") {
              return null;
            }
            return (
              <ListItem key={name} disablePadding>
                <ListItemButton>
                  <Link href={route}>
                    <ListItemText primary={name} />
                  </Link>
                </ListItemButton>
              </ListItem>
            );
          }),
          <ListItem key="login" disablePadding>
            <ListItemButton>
              <Link
                href="/login"
                onClick={() => {
                  if (userState.loggedIn) {
                    dispatch.user.logout();
                  }
                }}
              >
                <ListItemText
                  primary={userState.loggedIn ? "logout" : "login"}
                />
              </Link>
            </ListItemButton>
          </ListItem>,
        ]}
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer
          anchor={"right"}
          open={drawerState.open}
          onClose={toggleDrawer(false)}
        >
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
  const dispatch = useDispatch<Dispatch>();
  const userState = useSelector((state: RootState) => state.user);

  function handleResize() {
    if (
      window.matchMedia(theme.breakpoints.up("sm").replace("@media ", ""))
        .matches
    ) {
      if (mobile) {
        dispatch.drawer.close();
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
                <Link href="/">
                  <Image
                    src="/logo.jpg"
                    alt="logo"
                    hidden={router.pathname == "/" ? true : false}
                    width={718}
                    height={394}
                    style={{ width: "160px", height: "auto", paddingTop: 5 }}
                  />
                </Link>
              </Grid2>
            </Grid2>
            <Box
              sx={{
                flexGrow: 1,
                display: mobile ? "none" : "flex",
              }}
            >
              {[
                ...Object.entries(pages).map(([name, route]) => {
                  if (
                    userState.user.role != UserRole.MANAGER &&
                    name == "manage"
                  ) {
                    return null;
                  }
                  if (
                    userState.user.role != UserRole.MANAGER &&
                    name == "reports"
                  ) {
                    return null;
                  }
                  return (
                    <Button
                      sx={{
                        color:
                          router.pathname == route
                            ? theme.palette.primary.contrastText
                            : "inherit",
                        background:
                          router.pathname == route
                            ? theme.palette.primary.main
                            : "inherit",
                      }}
                      key={name}
                      onClick={() => router.push(route)}
                    >
                      {name}
                    </Button>
                  );
                }),
                <Button
                  sx={{
                    color: "inherit",
                    background: "inherit",
                  }}
                  key={"login"}
                  onClick={() => {
                    if (userState.loggedIn) {
                      dispatch.user.logout();
                    } else {
                      router.push("/login");
                    }
                  }}
                >
                  {userState.loggedIn ? "logout" : "login"}
                </Button>,
              ]}
            </Box>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => dispatch.drawer.open()}
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
