import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../models/database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // real response
    console.log(req.query.shipmentId);
    database.query(
      `update shipment set fulfilled = true where shipment_id = ${req.query.shipmentId}`
    );

    res.status(200);
  }