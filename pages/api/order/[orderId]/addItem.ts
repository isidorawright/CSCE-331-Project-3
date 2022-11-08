import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";
import { OrderItem } from "../../../../models/orderItem";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const orderItem = new OrderItem(req.body);

    const id = await database
      .query(
        `
      insert into order_item (order_id, menu_item_id)\
      values (
        ${orderItem.orderId},
        ${orderItem.menuItem.id},
      ) returning order_item_id;
    `
      )
      .then((res) => res.rows[0].order_item_id);

    orderItem.id = id;

    await Promise.all(
      orderItem.products.map((product) => {
        return database.query(`
          insert into order_item_product (order_item_order_item_id, product_product_id)\
          values (
            ${orderItem.id},
            ${product.id},
          );
        `);
      })
    );

    res.status(200).json(orderItem);
  } catch (e) {
    res.status(400).end();
  }
}
