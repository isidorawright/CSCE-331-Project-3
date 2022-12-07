import { fromMoneyString, Money, toMoneyString } from "../util/money";
import { IOrderItem, OrderItem } from "./orderItem";

export interface IOrder {
  id: number;
  orderDate: Date;
  orderTotal: string;
  subTotal: string;
  tax: string;
  // using the interface instead of the class is important
  // it enables serialization
  orderItems: IOrderItem[];
  totalItems?: number;
}

/**
  * @param data
  * @param omit
  * @return order or null for all values if the order does not exist
*/
export function Order(data?: IOrder, omit?: string[]): IOrder {
  if (data) {
    const order = { ...data };
    if (!omit || !omit.includes("orderItems")) {
      order.orderItems = data.orderItems.map((i) => OrderItem(i));
    }
    return order;
  }
  return {
    id: -1,
    orderDate: new Date(),
    orderTotal: "$0.00",
    subTotal: "$0.00",
    tax: "$0.00",
    orderItems: [],
  };
}

export namespace Order {
  /**
   *@param order
   * @return order
  */
  export function calculateTotals(order: IOrder): IOrder {
    order.subTotal = order.orderItems
      .reduce(
        (acc, o) => acc.add(Money.of(o.menuItem.price).mul(o.quantity)),
        Money.of(0)
      )
      .toString();
    order.tax = Money.of(order.subTotal).mul(0.07).toString();
    order.orderTotal = Money.of(order.subTotal).add(order.tax).toString();
    return order;
  }
  /**
   * @param order
   * @param item
   * @return order
  */
  export function addItem(order: IOrder, item: IOrderItem): IOrder {
    const existing = order.orderItems.find((o) => OrderItem.equals(o, item));
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      order.orderItems.push(item);
    }
    order = Order.calculateTotals(order);
    return order;
  }
}
