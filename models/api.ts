import { IMenuCategory, MenuCategory } from "./menu";
import { Product, IProduct } from "./product";

export namespace api {
  async function getMenuCategories(): Promise<MenuCategory[]> {
    const response = await fetch("/api/menu/categories");
    const json = await response.json();
    return json.items.map((c: IMenuCategory) => new MenuCategory(c));
  }
  async function getProducts(): Promise<Product[]> {
    const response = await fetch("/api/menu/products");
    const json = await response.json();
    return json.items.map((p: IProduct) => new Product(p));
  }
  export namespace category {
    async function find(id: number): Promise<MenuCategory> {
      const response = await fetch(`/api/menu/category/${id}`);
      const json = await response.text();
      // it doesnt matter here but if a type contains other types then do it this way
      return MenuCategory.fromJSON(json);
    }
  }
}
