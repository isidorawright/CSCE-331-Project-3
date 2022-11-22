import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CustomTheme, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
import { api } from "../models/api";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../models/store";
import { User, UserRole } from "../models/user";

export default function SignIn() {
  const theme = useTheme<CustomTheme>();
  const router = useRouter();

  const [error, setError] = React.useState("");
  const [registering, setRegistering] = React.useState(false);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);

    try {
      if (registering) {
        await dispatch.user.register(
          User({
            username: data.get("username") as string,
            password: data.get("password") as string,
            id: -1,
            authenticated: false,
            role: UserRole.CUSTOMER,
          })
        );
      } else {
        await dispatch.user.login(
          User({
            username: data.get("username") as string,
            password: data.get("password") as string,
            id: -1,
            authenticated: false,
            role: UserRole.CUSTOMER,
          })
        );
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div>
      <Container component="main" maxWidth="xs">
        <Head>
          <title>Spin &apos;N Stone | Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: theme.palette.background.paper,
            padding: theme.spacing(5),
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {registering ? "Register" : "Sign In"}
            </Button>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </Box>
            <Grid container>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  onClick={() => {
                    setRegistering(!registering);
                    setError("");
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  {registering
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign Up"}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  onClick={() => {
                    setError("too bad, write it down next time");
                  }}
                  sx={{
                    cursor: "pointer",
                  }}
                >
                  Forgot password?
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
