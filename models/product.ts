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

  constructor({
    productId,
    productName,
    quantityInStock,
    conversionFactor,
    productTypeId,
  }: IProduct) {
    Object.assign(this, {
      productId,
      productName,
      quantityInStock,
      conversionFactor,
      productTypeId,
    });
  }

  static fromJSON(json: string): Product {
    const data = JSON.parse(json) as IProduct;

    return new Product(data);
  }

  toJSON(): string {
    return JSON.stringify(this);
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
