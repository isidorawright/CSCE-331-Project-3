import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import database from "../../../models/database";
import { User, UserRole } from "../../../models/user";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  /**
   * @param req 
   * @param res 
   * @returns user stauts
   */
  async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { username, password } = req.body;
      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await database
        .query(`SELECT * from "user" where username = '${username}' LIMIT 1`)
        .then((result) => result.rows[0]);

      console.log(`
        ${user.password}
        ${encryptedPassword}
      `);

      if (!user) {
        res.status(400).send("Username and password are required");
        return;
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!user || !valid) {
        res.status(401).end();
        return;
      }

      req.session.user = User({
        username,
        role: user.role,
        id: user.useer_id,
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
