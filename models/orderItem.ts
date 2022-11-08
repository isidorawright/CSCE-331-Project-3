import { IMenuItem, MenuItem } from "./menuItem";
import { IProduct, Product } from "./product";

export interface IOrderItem {
  id: number;
  orderId: number;
  menuItemId: number;

  products: IProduct[];
  menuItem: IMenuItem;

  quantity: number;
  isDrink: boolean;
}

// todo

export class OrderItem implements IOrderItem {
  id = -1;
  orderId = -1;
  menuItemId = -1;

  products: Product[] = [];
  menuItem: IMenuItem;

  quantity = 0;
  isDrink = false;

  constructor(data: IOrderItem, omit?: string[]) {
    Object.assign(this, data);
    // potential recursive reference
    if (!omit || !omit.includes("products")) {
      this.products = data.products.map((p) => new Product(p));
    }
    if (!omit || !omit.includes("menuItem")) {
      this.menuItem = new MenuItem(data.menuItem);
    } else {
      this.menuItem = data.menuItem;
    }
  }

  equals(other: IOrderItem): boolean {
    return (
      this.id === other.id &&
      this.orderId === other.orderId &&
      this.menuItemId === other.menuItemId &&
      this.quantity === other.quantity &&
      this.isDrink === other.isDrink &&
      this.products.length === other.products.length &&
      this.products.every((p, i) => p.equals(other.products[i]))
    );
  }
}
