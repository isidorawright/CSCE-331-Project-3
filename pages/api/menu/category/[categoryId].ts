import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // real response
  let category = database.query(
    `SELECT * FROM categories WHERE id = ${req.query.categoryId}`
  );
  console.log(category);
  res.status(200).json(category);
}
