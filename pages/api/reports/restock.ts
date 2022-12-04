import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import _ from "lodash";
import { Shipment } from "../../../models/shipment";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const restock_threshold = 500;
    try {
        // get quantity of a product in a shipment
        let restock: {[key: string] : string} = {};

        if (req.method === "GET") {
            const response = await database.query(
                `select * from product`
            ).then(response => response.rows)
            response.forEach(element => {
                if (element.quantity_in_stock < restock_threshold) {
                    restock[element.product_name] = element.quantity_in_stock;
                }
            });

            res.status(200).json(restock);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}