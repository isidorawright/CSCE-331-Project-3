import { IMenuCategory, MenuCategory } from "./menu";
import { IProduct, Product } from "./product";

export interface IMenuItem {
  id: number;
  name: string;
  price: number;
  configurable: boolean;

  category: IMenuCategory;
  products: IProduct[];
  active: boolean;
}

export class MenuItem implements IMenuItem {
  id = -1;
  name = "";
  price = 0.0;
  configurable = false;
  category: IMenuCategory = { id: -1, name: "", active: false, menuItems: [] };
  products: IProduct[] = [];
  active = false;

  constructor(data: IMenuItem, omit?: string[]) {
    Object.assign(this, data);
    if (!omit || !omit.includes("category")) {
      this.category = new MenuCategory(data.category, ["menuItems"]);
    }
    if (!omit || !omit.includes("products")) {
      this.products = data.products.map((p) => new Product(p));
    }
  }
}
