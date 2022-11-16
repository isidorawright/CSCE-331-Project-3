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

export function OrderItem(data?: IOrderItem, omit?: string[]): IOrderItem {
  if (data) {
    const item = { ...data };
    if (!omit || !omit.includes("menuItem")) {
      item.menuItem = MenuItem(data.menuItem, ["menuItems"]);
    }
    if (!omit || !omit.includes("products")) {
      item.products = data.products.map((p) => Product(p));
    }
    return item;
  }
  return {
    id: -1,
    orderId: -1,
    menuItemId: -1,
    products: [],
    menuItem: MenuItem(),
    quantity: 1,
    isDrink: false,
  };
}

export namespace OrderItem {
  export function equals(order: IOrderItem, other: IOrderItem): boolean {
    return (
      order.id === other.id &&
      order.orderId === other.orderId &&
      order.menuItemId === other.menuItemId &&
      order.quantity === other.quantity &&
      order.isDrink === other.isDrink &&
      order.products.length === other.products.length &&
      order.products.every((p, i) => Product.equals(p, other.products[i]))
    );
  }
}
