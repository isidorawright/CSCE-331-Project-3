import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../models/database";
import { IShipment, Shipment } from "../../../models/shipment";
import { IProduct, Product } from "../../../models/product";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get a Shipment
        if (req.method === "GET") {
            let shipment = await database.query(
                `select * from shipment 
                full outer join shipment_product on
                      shipment_shipment_id = shipment_id
                full outer join product on	  
                      product.product_id = product_product_id
                where shipment_id = ${req.query.shipmentId}`
                ).then((res) => res.rows);
            
              const result = _.chain(shipment)
                .groupBy("shipment_id")
                .map(rows => {
                    let firstRow = rows[0];
                    return Shipment({
                        shipmentId: firstRow?.shipment_id,
                        shipmentDate: firstRow?.shipment_date,
                        fulfilled: firstRow?.fulfilled,
                        products: rows.map(row => {
                            return Product ({
                                id: row.product_id,
                                productName: row.product_name,
                                quantityInStock: row.quantity_in_stock,
                                conversionFactor: row.conversion_factor,
                                productTypeId: row.product_type_id,
                                productType: row.product_type_name
                            })
                        })
                    });
                }).value();

            res.status(200).json(result);
        }
        // Update shipment (Does not modify products, those should be added using the product API within shipments)
        else if (req.method === "PUT") {
            const result = await database.query(
                `update shipment set fulfilled = ${req.query.fulfilled}, shipment_date = ${req.query.shipmentDate} where shipment_id = ${req.query.shipmentId} returning shipment_id`
            );
            res.status(200).send(result.rows);
        }
        // Delete shipment (also deletes products that were in shipment)
        else if (req.method === "DELETE") {
            const result = database.query(
                `delete from shipment where shipment_id = ${req.query.shipmentId} returning shipment_id`
            );
            res.status(200).json(result);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}
  