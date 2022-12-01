import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import _ from "lodash";
import { Shipment } from "../../../models/shipment";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get quantity of a product in a shipment
        if (req.method === "GET") {
            const response = await database.query(
                `select menu_item.item_name, sum(menu_item.menu_item_price) as sales from "order"
                join order_item on order_item.order_id = "order".order_id
                join menu_item on menu_item.menu_item_id = order_item.menu_item_id
                where "order".order_date between ${req.query.startDate} and ${req.query.endDate}
                group by menu_item.menu_item_id
                order by menu_item.menu_item_id`
            )

            res.status(200).send(response.rows);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}