import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { IShipment, Shipment } from "../../models/shipment";
import { IProduct, Product } from "../../models/product";

/**
 * GET and POST requests the user may make for shipments and their respective logic
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get all shipments
        if (req.method === "GET") {
            let shipment = await database.query(
                `select * from shipment 
                full outer join shipment_product on
                      shipment_product.shipment_shipment_id = shipment.shipment_id
                full outer join product on	  
                      product.product_id = shipment_product.product_product_id`
                ).then((res) => res.rows);
            
              const result = _.chain(shipment)
                .filter(shipment => shipment.shipment_id)
                .groupBy("shipment_id")
                .map((rows, shipment_id) => {
                    let firstRow = rows[0];
                  return Shipment({
                    shipmentId: firstRow?.shipment_id,
                    shipmentDate: firstRow?.shipment_date,
                    fulfilled: firstRow?.fulfilled,
                    products: _.chain(rows)
                        .map((row) => {
                            return Product ({
                                id: row.product_id,
                                productName: row.product_name,
                                quantityInStock: row.quantity_in_stock,
                                conversionFactor: row.conversion_factor,
                                productTypeId: row.product_type_id
                            })
                        }).value()
                  })
                })
                .value();

            res.status(200).json(result);
        }
        // create a new shipment (Note: does not add products, those should be added using the shipment/[shipmentId]/product/[productId] API)
        else if (req.method === "POST") {
            const result = await database.query(
                `insert into shipment (shipment_date, fulfilled) values (${req.query.shipmentDate}, ${req.query.fulfilled}) returning shipment_id`
            );

            res.status(200).send(result.rows);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (error) {
        res.status(400).end();
    }
}
  