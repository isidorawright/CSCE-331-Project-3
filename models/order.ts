import { IOrderItem, OrderItem } from "./orderItem";

export interface IOrder {
  orderId: number;
  orderDate: Date;
  orderTotal: number;
  subTotal: number;
  tax: number;
  // using the interface instead of the class is important
  // it enables serialization
  orderItems: IOrderItem[];
}

// todo

export class Order implements IOrder {
  orderId = -1;
  orderDate = new Date();
  orderTotal = 0;
  subTotal = 0;
  tax = 0;
  orderItems: IOrderItem[] = [];

  constructor(data?: IOrder) {
    if (data) {
      Object.assign(this, data);
      this.orderItems = data.orderItems.map((o) => new OrderItem(o));
    }
  }

  calculateTotals() {
    this.subTotal = this.orderItems.reduce(
      (acc, o) => acc + o.menuItem.price * o.quantity,
      0
    );
    this.tax = this.subTotal * 0.07;
    this.orderTotal = this.subTotal + this.tax;
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
