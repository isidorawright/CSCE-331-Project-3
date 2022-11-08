import { PHASE_PRODUCTION_SERVER } from "next/dist/shared/lib/constants";

export interface IProduct {
  id: number;
  productName: string;
  quantityInStock: number;
  conversionFactor: number;
  productTypeId: number;

  selected?: boolean;
}

export class Product implements IProduct {
  id = -1;
  productName = "";
  quantityInStock = 0;
  conversionFactor = 0.0;
  productTypeId = -1;

  selected = false;

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

  equals(other: IProduct): boolean {
    return (
      this.id === other.id &&
      this.productName === other.productName &&
      this.quantityInStock === other.quantityInStock &&
      this.conversionFactor === other.conversionFactor &&
      this.productTypeId === other.productTypeId
    );
  }
}
