import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { IShipment, Shipment } from "../../models/shipment";
import { IProduct, Product } from "../../models/product";
  
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // get a Shipment
        if (req.method === "GET") {
            let shipment = await database.query(
                `select * from shipment 
                full outer join shipment_product on
                      shipment_product.shipment_shipment_id = shipment.shipment_id
                full outer join product on	  
                      product.product_id = shipment_product.product_product_id`
                )
                .then((res) => res.rows);
            
              const result = _.chain(shipment)
                .groupBy("shipment_id")
                .map((rows, shipment_id) => {
                  return Shipment({
                    shipmentId: rows[0]?.shipment_id,
                    shipmentDate: rows[0]?.shipment_date,
                    fulfilled: rows[0]?.fulfilled,
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
        // create a new shipment (Note: does add products, those should be added ussing the product API within shipments)
        if (req.method === "POST") {
            const result = await database.query(
                `insert into shipment_product (shipment_shipment_id, product_product_id, quantity_ordered) values (${req.query.shipmentId}, ${req.query.productId}, ${req.query.quantity})`
            );

            res.status(200).send(req.query.shipmentId);
        }
        // Update shipment (Does not modify products, those should be added ussing the product API within shipments)
        else if (req.method === "PUT") {
            database.query(
                `update shipment_product set quantity_ordered = ${req.query.quantity} where shipment_shipment_id = ${req.query.shipmentId} and product_product_id = ${req.query.productId}`
            );
            res.status(200).send(req.query.shipmentId);
        }
        // Delete shipment (also deletes products that were in shipment)
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
  