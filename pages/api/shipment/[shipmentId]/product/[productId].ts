import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../../models/database";
import { IProduct, Product } from "../../../../../models/product";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get quantity of a product in a shipment
        if (req.method === "GET") {
            const response = await database.query(
                `select quantity_ordered from shipment_product where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
            );
            res.status(200).send(response.rows);
        }
        // create a new product in a shipment
        if (req.method === "POST") {
            database.query(
                `insert into shipment_product (shipment_shipment_id, product_product_id, quantity_ordered) values (${req.query.shipmentId}, ${req.query.productId}, ${req.query.quantity})`
            );

            res.status(200).send(req.query.shipmentId);
        }
        // update quantity of product in shipment
        else if (req.method === "PUT") {
            database.query(
                `update shipment_product set quantity_ordered = ${req.query.quantity} where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
            );
            res.status(200).send(req.query.shipmentId);
        }
        // delete product entry in a shipment
        else if (req.method === "DELETE") {
            database.query(
                `delete from shipment_product where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
            );
            res.status(200).send(req.query.shipmentId);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}
  