import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { OAuth2Client } from "google-auth-library";
import database from "../../../models/database";
import { User, UserRole } from "../../../models/user";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Must verify google account
 * @param token 
 * @returns payload
 */
async function verify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload;
}

export default withIronSessionApiRoute(
  /**
   * @param req 
   * @param res
   */
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.session.user);
    const credential = req.query.credential;
    if (!credential) {
      res.status(400).json({ error: "No credential provided" });
      return;
    }
    if (credential instanceof Array) {
      res.status(400).json({ error: "Credential is an array" });
      return;
    }
    try {
      const ticket = await verify(credential);
      if (!ticket || !ticket.email) {
        res.status(400).json({ error: "Invalid credential" });
        return;
      }
      // user provided google credentials in either create an account for them or log them in

      const users = await database.query(
        `SELECT * from "user" where username = '${ticket.email}' and password = '${ticket.sub}' LIMIT 1`
      );

      if (users.rowCount === 0) {
        // create user
        let id = await database
          .query(
            `INSERT INTO "user" (username, password, role) VALUES ('${ticket.email}', '${ticket.sub}', 'Customer') RETURNING *`
          )
          .then((result) => result.rows[0].user_id);

        req.session.user = User({
          username: ticket.email,
          role: UserRole.CUSTOMER,
          id,
          authenticated: true,
        });
      } else {
        const user = users.rows[0];
        user.password = "";
        req.session.user = User(user);
      }

      await req.session.save();

      res.status(200).send(req.session.user);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: "Invalid credential" });
    }
  },
  {
    cookieName: "session",
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
