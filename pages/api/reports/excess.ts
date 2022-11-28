import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import _ from "lodash";
import { Shipment } from "../../../models/shipment";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get quantity of a product in a shipment
        if (req.method === "GET") {

            const total_stock = 500;
            let excess : {[key : string] : string} = {};

            // Query database for quanity sold of each product since a given date
            const response = await database.query(
                `select product_name, count(product_product_id) from "order"
                join order_item on order_item.order_id = "order".order_id
                join order_item_product on order_item_product.order_item_order_item_id = order_item.order_id
				join product on order_item_product.product_product_id = product.product_id
                where "order".order_date between ${req.query.date} and '01-01-23'
                group by product_name
                order by product_name`
            ).then(req => req.rows);
            
            // Determine if product has sold less than 10% of stock on hand
            response.forEach(product => {
                //excess.push(product.product_name);
                if (product.count < 500 * 0.1) {
                    // Include product name and percent sold in output
                    excess[product.product_name] =  product.count / 500 + "%";
                }
            });

            res.status(200).json(excess);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}