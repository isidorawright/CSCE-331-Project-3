import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import _ from "lodash";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Query database for all menu items in all orders within date parameters
        if (req.method === "GET") {
            let pairs: {[key :string] : number} = {};
            
            const response = await database.query(
                `select "order".order_id, item_name from "order"
                join order_item on order_item.order_id = "order".order_id
                join menu_item on menu_item.menu_item_id = order_item.menu_item_id
                where "order".order_date between '${req.query.startDate}' and '${req.query.endDate}'`
            ).then(res => res.rows);
            
            // Group orders together
            const result = _.chain(response).groupBy("order_id").value();
            
            // Iterate through each order, creating all possible item combinations
            for (let order in result) {
                for (let firstItem in result[order]) {
                    for (let secondItem in result[order]) {
                        let pair = [result[order][firstItem]["item_name"], result[order][secondItem]["item_name"]];
                        // Eliminate duplicates (same item combinations or identical permutatons)
                        if (pair[0] < pair[1]) {
                            let combo = pair[0] + ", " + pair[1];
                            // Create a new combination entry if not already stored
                            if (pairs[combo] === undefined) {
                                pairs[combo] = 1;
                            }
                            // Otherwise increment running total
                            else {
                                pairs[combo]++;
                            }
                        }
                    }
                }
            };

            var sorted_pairs = Object.fromEntries(
                Object.entries(pairs).sort(([,a],[,b]) => <number>b - <number>a)
            );

            res.status(200).json(sorted_pairs);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}