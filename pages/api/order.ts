import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { Order } from "../../models/order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    let body = req.body;
    try {
      let order = new Order(body);
      const res = await database.query(
        `insert into orders (order_date, order_total, sub_total, tax) values ('${order.orderDate}', ${order.orderTotal}, ${order.subTotal}, ${order.tax}) returning order_id`
      );

      order.orderId = res.rows[0].order_id;

      res.status(200).json(order);
    } catch (error) {
      res.status(400).end();
    }
  } else {
    res.status(404).json({ message: "Not found" });
  }
}
