import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import database from "../../../models/database";
import { User, UserRole } from "../../../models/user";
import { withIronSessionApiRoute } from "iron-session/next";

/**
 * Allows a user to register an account as long as they have manager (admin) priviledge
 * Also specifies the username and password requirements
 * If username already exists or does not have priviledge, then give an error message
 * @param req
 * @param res
 */
export default withIronSessionApiRoute(
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      if (req.body.username.length < 3) {
        res.status(400).send("Username must be at least 3 characters");
        return;
      }

      if (req.body.password.length < 10) {
        res.status(400).send("Password must be at least 10 characters");
        return;
      }

      let userExists = await database
        .query(
          `SELECT COUNT(*) from "user" where username = '${req.body.username}'`
        )
        .then((result) => result.rows[0].count);

      if (typeof userExists === "string") {
        userExists = parseInt(userExists);
      }

      if (userExists) {
        res.status(400).send("Username already exists");
        return;
      }

      const { username, password } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);

      if (!username || !password) {
        res.status(400).send("Username and password are required");
        return;
      }

      const userId = await database
        .query(
          `INSERT INTO "user" (username, password, role) VALUES ('${username}', '${encryptedPassword}', '${UserRole.CUSTOMER}') returning user_id`
        )
        .then((result) => result.rows[0].user_id);

      req.session.user = User({
        username,
        role: UserRole.CUSTOMER,
        id: userId,
        authenticated: true,
      });

      await req.session.save();

      res.status(200).json(req.session.user);
    } catch (e) {
      console.error(e);
      res.status(500).end();
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
