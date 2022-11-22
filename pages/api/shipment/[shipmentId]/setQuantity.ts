import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // real response
    console.log(req.query.shipmentId);
    database.query(
        `update shipment_product set quantity_ordered = ${req.query.quantity} where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
    );

    res.status(200).send("");
}