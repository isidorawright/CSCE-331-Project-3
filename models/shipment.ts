// import { Serializable } from "./serializable";

import { UrlWithStringQuery } from "url";
import database from "./database";
import { IProduct, Product } from "./product";
import { IMenuCategory, Menu, MenuCategory } from "./menu";
import { responseEncoding } from "axios";
import { api } from "./api";

export interface IShipment {
  shipmentId: number;
  shipmentDate: Date | string;
  fulfilled: boolean;
  products: IProduct[];
}

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
