import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET" || req.method == "FETCH"){
    const response = await database.query(
        `SELECT * FROM menu_item
        ORDER BY menu_item_id ASC`
      )
      
      res.status(200).send(response.rows);
      return;
  }

  else {
    res.status(405).end();
    return;
  }
}
