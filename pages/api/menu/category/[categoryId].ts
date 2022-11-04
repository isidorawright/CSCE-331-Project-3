import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // real response
  let category = await database.query(
    `SELECT * FROM menu_item_category WHERE menu_item_category_id = ${req.query.categoryId}`
  );
  res.status(200).json(category.rows);
}
