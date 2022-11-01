// import { Serializable } from "./serializable";

import { Product } from "./product";

export interface IShipment {
  shipmentId: number;
  shipmentDate: Date;
  fulfilled: boolean;
}

class Shipment implements IShipment {
  shipmentId = -1;
  shipmentDate = new Date();
  fulfilled = false;
  products: Product[] = [];

  static isoDatePattern = new RegExp(
    /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  );

  constructor({ shipmentId, shipmentDate, fulfilled }: IShipment) {
    Object.assign(this, { shipmentId, shipmentDate, fulfilled });
  }

  static fromJSON(json: string): Shipment {
    // https://stackoverflow.com/questions/10286204/what-is-the-right-json-date-format
    return new Shipment(
      JSON.parse(json, (key, value) => {
        if (key == "shipmentDate" && this.isoDatePattern.test(value)) {
          return new Date(value);
        }
        if (key == "products") {
          return (value as Product[]).map((p) => new Product(p));
        }
        return value;
      })
    );
  }

  insert() {
    // insert the shipment created client side
  }
  update() {
    // update the shipment with new values
  }
  delete() {
    // delete the shipment
  }
  getQuantitySold(start: Date, end: Date) {}
}
