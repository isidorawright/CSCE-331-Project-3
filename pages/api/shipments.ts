import type { NextApiRequest, NextApiResponse } from "next";
import { IShipment, Shipment } from "../../models/shipment";
import { Product } from "../../models/product";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // mock response
    let shipment = new Shipment ({
        shipmentId: 1,
        shipmentDate: "2022-10-29",
        fulfilled: true,
        products: [{
                productId: 3,
                productName: "Pumpkin",
                quantityInStock: 5,
                conversionFactor: 1.0,
                productTypeId: 1
            },
            {
                productId: 2,
                productName: "Cabbage",
                quantityInStock: 430,
                conversionFactor: 1.0,
                productTypeId: 2
            },
            {
                productId: 1,
                productName: "Pepperoni",
                quantityInStock: 430,
                conversionFactor: 1.0,
                productTypeId: 2
            },
        ]
    })

}