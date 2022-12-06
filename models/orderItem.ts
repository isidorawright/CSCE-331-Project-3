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
  selected?: boolean;
}

/**
  * @param data
  * @param omit
  * @return order item or null for all values if the order does not exist
*/
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
    selected: false,
  };
}

/**
  * @param order
  * @param other
  * @return order id: string
  * @return menu item id: string
  * @return if it is a drink: boolean
  * @return length of the products array: number
  * @return all products in the product array: IProduct
*/
export namespace OrderItem {
  export function equals(order: IOrderItem, other: IOrderItem): boolean {
    return (
      order.orderId === other.orderId &&
      order.menuItemId === other.menuItemId &&
      order.isDrink === other.isDrink &&
      order.products.length === other.products.length &&
      order.products.every((p, i) => Product.equals(p, other.products[i]))
    );
  }
}
