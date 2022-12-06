export interface IProduct {
  id: number;
  productName: string;
  quantityInStock: number;
  conversionFactor: number;
  productTypeId: number;

  productType?: string;
  selected?: boolean;
  optional?: boolean;
}

/**
 * @param product
 * @returns product or null if it does not exist
 */
export function Product(product?: IProduct): IProduct {
  if (product) {
    return product;
  }
  return {
    id: -1,
    productName: "",
    quantityInStock: 0,
    conversionFactor: 0,
    productTypeId: -1,
  } as IProduct;
}

/**
 * @param product
 * @param other
 * @return id
 * @return product name
 * @return quantity in stock
 * @retun conversion factor
 * @return product type
 */
export namespace Product {
  export function equals(product: IProduct, other: IProduct): boolean {
    return (
      product.id === other.id &&
      product.productName === other.productName &&
      product.quantityInStock === other.quantityInStock &&
      product.conversionFactor === other.conversionFactor &&
      product.productTypeId === other.productTypeId
    );
  }
}
