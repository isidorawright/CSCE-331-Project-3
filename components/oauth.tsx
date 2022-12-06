import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import store from "../models/store";

export function OauthLogin() {
  useEffect(() => {
    (window as any).google.accounts.id.renderButton(
      document.getElementById("oauth-login"),
      { theme: "outline", size: "large" } // customization attributes
    );
    
  });
  return <Button fullWidth sx={{ mt: 3, mb: 2 }} id="oauth-login"></Button>;
}
