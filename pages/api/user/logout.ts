import { IronSession } from "iron-session";
import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * @param req
 * @param res
 */
export default withIronSessionApiRoute(
  async function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy();
    res.status(200).end();
  },
  {
    cookieName: "session",
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
