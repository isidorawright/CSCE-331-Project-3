import { isGeneratorFunction } from "util/types";
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

export class Order implements IOrder {
  orderId = -1;
  orderDate = new Date();
  orderTotal = -1;
  subTotal = -1;
  tax = -1;

  orderItems: OrderItem[] = [];

  constructor (order: IOrder) {
    
  }

  insert() {
    
  }

}

// todo
