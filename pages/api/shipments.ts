import type { NextApiRequest, NextApiResponse } from "next";
import { IShipment, Shipment } from "../../models/shipment";
import { Product } from "../../models/product";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  let shipment = Shipment({
    shipmentId: 1,
    shipmentDate: "2022-10-29",
    fulfilled: true,
    products: [
      {
        id: 3,
        productName: "Pumpkin",
        quantityInStock: 5,
        conversionFactor: 1.0,
        productTypeId: 1,
      },
      {
        id: 2,
        productName: "Cabbage",
        quantityInStock: 430,
        conversionFactor: 1.0,
        productTypeId: 2,
      },
      {
        id: 1,
        productName: "Pepperoni",
        quantityInStock: 430,
        conversionFactor: 1.0,
        productTypeId: 2,
      },
    ],
  });
}
