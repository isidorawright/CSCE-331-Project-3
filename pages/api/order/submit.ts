import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import { IOrder } from "../../../models/order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const order: IOrder = req.body;
  // let the ui define the cost, we are not collecting money anyway lol
  // create the order
  let orderId = await database
    .query(
      `insert into "order" (order_date, order_total) values ('${order.orderDate}', '${order.orderTotal}') returning order_id`
    )
    .then((result) => result.rows[0].order_id);
  // add the order items
  await Promise.all(
    order.orderItems.map(async (item) => {
      let orderItemIds = [];
      var orderItemId = -1;
      for(let i = 0; i < item.quantity; i++){
        orderItemId = await database
          .query(
            `insert into order_item (order_id, menu_item_id) values (${orderId}, ${item.menuItem.id}) returning order_item_id`
          )
          .then((result) => result.rows[0].order_item_id);
        orderItemIds.push(orderItemId);
      }

      await Promise.all(
        orderItemIds.map(async (orderItemId) => {
          await Promise.all(
            item.products.map((product) => {
              return Promise.all([
                // create the orderitem/product link
                database.query(
                  `insert into order_item_product (order_item_order_item_id, product_product_id) values (${orderItemId}, ${product.id})`
                ),
                // update the product quantity
                database.query(
                  `update product set quantity_in_stock = quantity_in_stock - 1 where product_id = ${product.id} AND quantity_in_stock >= 0`
                ),
              ]);
            })
          );
        })
      );
    })
  );

  res.status(200).end();
}
