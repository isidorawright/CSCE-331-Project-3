import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { Order } from "../../models/order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET" || req.method == "FETCH"){
    const response = await database.query(
        `select "order".order_id, order_date, order_total, count(order_item.menu_item_id) from "order"
        join order_item on order_item.order_id = "order".order_id
        where order_date between '2022-10-01' and current_date
        group by "order".order_id
        order by order_date desc`
      )
      res.status(200).send(response.rows);
      return;
  }

  else if (req.method === "POST") {
    let body = req.body;
    try {
      let order = Order(body);
      const result = await database.query(
        `insert into orders (order_date, order_total, sub_total, tax) values ('${order.orderDate}', ${order.orderTotal}, ${order.subTotal}, ${order.tax}) returning order_id`
      );

      order.id = result.rows[0].order_id;

      res.status(200).json(order);
    } catch (error) {
      res.status(400).end();
    }
  } 
  
  else {
    res.status(404).json({ message: "Not found" });
  }
}
