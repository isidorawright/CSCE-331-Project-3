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
}
