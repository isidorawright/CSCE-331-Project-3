import { IProduct, Product } from "./product";

export interface IShipment {
  shipmentId: number;
  shipmentDate: Date | string;
  fulfilled: boolean;
  products: IProduct[];
}

/**
 * @param data 
 * @return shipment ID
 * @return shipment date
 * @return fulfilled status
 * @return products array. Contains all products inside the shipment
 */
export function Shipment(data?: IShipment): IShipment {
  if (data) {
    return {
      shipmentId: data.shipmentId,
      shipmentDate: new Date(data.shipmentDate),
      fulfilled: data.fulfilled,
      products: data.products.map((p) => Product(p)),
    };
  }
  return {
    shipmentId: -1,
    shipmentDate: new Date(),
    fulfilled: false,
    products: [],
  };
}
