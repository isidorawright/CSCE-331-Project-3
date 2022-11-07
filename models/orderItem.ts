import { IProduct, Product } from "./product";

export interface IOrderItem {
  id: number;
  orderId: number;
  menuItemId: number;

  products: IProduct[];
  // menuItem: IMenuItem;

  quantity: number;
  isDrink: boolean;
}

export class OrderItem implements IOrderItem {
  id = -1;
  orderId = -1;
  menuItemId = -1;

  products: Product[] = [];

  quantity = -1;
  isDrink = false;

  

}

// todo
