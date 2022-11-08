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

export class Shipment implements IShipment {
  shipmentId = -1;
  shipmentDate = new Date();
  fulfilled = false;
  products: Product[] = [];

  constructor(shipment: IShipment) {
    if (typeof shipment.shipmentDate === "string") {
      shipment.shipmentDate = new Date(shipment.shipmentDate);
    }
    shipment.products = shipment.products.map((p) => new Product(p));
    Object.assign(this, shipment);
  }

  insert() {
    // insert the shipment created client side
  }
  update() {
    // update the shipment with new values
  }
  delete() {
    // delete the shipment from local shipmentId
  }
  fulfull() {
    api.shipment.fulfill(this);
  }
  //getQuantitySold(start: Date, end: Date) {} // on second sprint

}
