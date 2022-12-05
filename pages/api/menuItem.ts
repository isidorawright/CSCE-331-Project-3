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
  else if (req.method == "POST") {
    const response = await database.query(
      `insert into menu_item (item_name, menu_item_price, menu_item_category_id, configurable)
      values ('${req.query.itemName}', '${req.query.itemPrice}', 3, false)`
    )
    
    res.status(200).send(response.rows);
    return;
  }
  else if (req.method == "PUT") {
    const response = await database.query(
      `update menu_item set menu_item_price = '${req.query.itemPrice}' where item_name = '${req.query.itemName}'`
    )
    
    res.status(200).send(response.rows);
    return;
  }
  else {
    res.status(405).end();
    return;
  }
}
