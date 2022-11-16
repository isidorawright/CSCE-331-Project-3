import { range } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await Promise.all(
      [1, 2].map((x) => {
        return Promise.all(
          range(4, 32).map((y) => {
            return database.query(
              `insert into menu_item_product (menu_item_menu_item_id, product_product_id, optional) values (${x}, ${y}, true)`
            );
          })
        );
      })
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
  res.status(200).json({ success: true });
}
