import { IMenuCategory, Menu, MenuCategory } from "./menu";
import { Product, IProduct } from "./product";

export namespace api {
  export async function getMenuCategories(): Promise<MenuCategory[]> {
    const response = await fetch("/api/menu/categories");
    const json = await response.json();
    return json.items.map((c: IMenuCategory) => new MenuCategory(c));
  }
  export async function getProducts(): Promise<Product[]> {
    const response = await fetch("/api/menu/products");
    const json = await response.json();
    return json.items.map((p: IProduct) => new Product(p));
  }
  export async function getMenu(): Promise<Menu> {
    const response = await fetch("/api/menu");
    const json = await response.json();
    return new Menu(json);
  }
  export namespace category {
    async function find(id: number): Promise<MenuCategory> {
      const response = await fetch(`/api/menu/category/${id}`);
      const json = await response.json();
      // it doesnt matter here but if a type contains other types then do it this way
      return new MenuCategory(json);
    }
  }
}
