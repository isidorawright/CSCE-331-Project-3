import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CustomTheme, useTheme } from "@mui/material";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../models/store";
import { User, UserRole } from "../models/user";
import { OauthLogin } from "../components/oauth";

export default function SignIn() {
  const theme = useTheme<CustomTheme>();

  const [registering, setRegistering] = React.useState(false);
  const userState = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<Dispatch>();
  const error = userState.error;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch.user.setError("");
    const data = new FormData(event.currentTarget);

    const user = data.get("username");

    if (registering) {
      if (data.get("password") !== data.get("password2")) {
        dispatch.user.setError("Passwords do not match");
        return;
      }

      if (!user) {
        dispatch.user.setError("Username is required");
        return;
      }

      if (user.toString().length < 3) {
        dispatch.user.setError("Username must be at least 3 characters");
        return;
      }
    }

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
      dispatch.user.setError(e.message);
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
          {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{color: "white"}}>
            {registering ? "Sign up" : "Sign in"}
          </Typography> */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            // noValidate
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
              inputProps={{
                minLength: 3,
              }}
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
              inputProps={{
                minLength: 10,
              }}
            />
            {registering && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                autoComplete="current-password"
                inputProps={{
                  minLength: 10,
                }}
              />
            )}
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
            <OauthLogin />

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
                    dispatch.user.setError("");
                  }}
                  sx={{
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  {registering
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Typography>
              </Grid>
              {/* <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  onClick={() => {
                    setError("too bad, write it down next time");
                  }}
                  sx={{
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  Forgot password?
                </Typography>
              </Grid> */}
            </Grid>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
