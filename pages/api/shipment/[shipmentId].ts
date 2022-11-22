import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import { IShipment, Shipment } from "../../../models/shipment";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     // real response
//     console.log(req.query.shipmentId);
//     database.query(
//       `select * from shipment where shipment_id = ${req.query.shipmentId}`
//     );

//     res.status(200).send("");
//   }

  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "GET") {
            const response = database.query(
                `select * from shipment where shipment_id = ${req.query.shipmentId}`
            );
            res.status(200).json(response);
        }
        if (req.method === "POST") {
            const result = await database.query(
                `insert into shipment_product (shipment_shipment_id, product_product_id, quantity_ordered) values (${req.query.shipmentId}, ${req.query.productId}, ${req.query.quantity})`
            );

            res.status(200).send(req.query.shipmentId);
        }
        else if (req.method === "PUT") {
            database.query(
                `update shipment_product set quantity_ordered = ${req.query.quantity} where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
            );
            res.status(200).send(req.query.shipmentId);
        }
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
  