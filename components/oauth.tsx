import { Box } from "@mui/material";
import { useEffect } from "react";

export function OauthLogin() {
  useEffect(() => {
    (window as any).google.accounts.id.renderButton(
      document.getElementById("oauth-login"),
      { theme: "outline", size: "large" } // customization attributes
    );
  });
  return <Box id="oauth-login"></Box>;
}
