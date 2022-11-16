import { IMenuCategory, MenuCategory } from "./menu";
import { IProduct, Product } from "./product";

export interface IMenuItem {
  id: number;
  name: string;
  price: string;
  configurable: boolean;
  category: IMenuCategory;
  products: IProduct[];

  active?: boolean;
}

export function MenuItem(data?: IMenuItem, omit?: string[]): IMenuItem {
  if (data) {
    const item = { ...data };
    if (!omit || !omit.includes("category")) {
      item.category = MenuCategory(data.category, ["menuItems"]);
    }
    if (!omit || !omit.includes("products")) {
      item.products = data.products.map((p) => Product(p));
    }
    return item;
  }
  return {
    id: -1,
    name: "",
    price: "$0.00",
    configurable: false,
    category: MenuCategory(),
    products: [],
  };
}
