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

// todo
