import { IOrderItem } from "./orderItem";

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
