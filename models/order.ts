import { IOrderItem } from "./orderItem";

export interface IOrder {
  orderId: number;
  orderDate: Date;
  orderTotal: number;
  subTotal: number;
  tax: number;
  orderItems: IOrderItem[];
}

// todo
