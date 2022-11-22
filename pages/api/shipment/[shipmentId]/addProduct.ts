import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // real response
    console.log(req.query.shipmentId);
    database.query(
        `insert into shipment_product (shipment_shipment_id, product_product_id, quantity_ordered) values (${req.query.shipmentId}, ${req.query.productId}, ${req.query.quantity})`
    );

    res.status(200).send("");
}