import { fromMoneyString, Money, toMoneyString } from "../util/money";
import { IOrderItem, OrderItem } from "./orderItem";

export interface IOrder {
  orderId: number;
  orderDate: Date;
  orderTotal: string;
  subTotal: string;
  tax: string;
  // using the interface instead of the class is important
  // it enables serialization
  orderItems: IOrderItem[];
}

// todo

export class Order implements IOrder {
  orderId = -1;
  orderDate = new Date();
  orderTotal = "$0.00";
  subTotal = "$0.00";
  tax = "$0.00";
  orderItems: IOrderItem[] = [];

  constructor(data?: IOrder) {
    if (data) {
      Object.assign(this, data);
      this.orderItems = data.orderItems.map((o) => new OrderItem(o));
    }
  }

  calculateTotals() {
    this.subTotal = this.orderItems
      .reduce(
        (acc, o) => acc.add(o.menuItem.price).mul(o.quantity),
        Money.of(0)
      )
      .toString();
    this.tax = Money.of(this.subTotal).mul(0.07).toString();
    this.orderTotal = Money.of(this.subTotal).add(this.tax).toString();
  }

  addItem(item: IOrderItem) {
    const existing = this.orderItems.find((o) => (o as OrderItem).equals(item));
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.orderItems.push(item);
    }
    this.calculateTotals();
  }

  insert() {
    // create a new order
    // create the order items
    // add products the the order items
    // add the order items to the order
  }
}
