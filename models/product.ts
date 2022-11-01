import { PHASE_PRODUCTION_SERVER } from "next/dist/shared/lib/constants";

export interface IProduct {
  productId: number;
  productName: string;
  quantityInStock: number;
  conversionFactor: number;
  productTypeId: number;
}

export class Product implements IProduct {
  productId = -1;
  productName = "";
  quantityInStock = 0;
  conversionFactor = 0.0;
  productTypeId = -1;

  constructor(product: IProduct) {
    Object.assign(this, product);
  }

  insert() {
    // TODO
  }

  update() {
    // TODO
  }

  delete() {
    // optional
  }
}
