import { IMenuCategory, Menu, MenuCategory } from "./menu";
import { IShipment, Shipment } from "./shipment";
import { Product, IProduct } from "./product";
import { responseEncoding } from "axios";

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
    export async function find(id: number): Promise<MenuCategory> {
      const response = await fetch(`/api/menu/category/${id}`);
      const json = await response.json();
      // it doesnt matter here but if a type contains other types then do it this way
      return new MenuCategory(json);
    }
  }
  /*export async function getUser(): Promise<> {
    const response = await fetch("api/user");
    const json = await response.json;
    return json.items.map((u: ))
  }*/

  export namespace shipment {
    export async function fulfill(shipment: Shipment): Promise<Response> {
      return await fetch(`/api/shipment/${shipment.shipmentId}/fulfill/`);
    }
  }
}


/* 
  Menu Item
    • Get Menu Category
    • Add a new menu item
    • Get all menu items with given category
    • Get products addable to given menu item (pass in menuitem object)
  Order
    • Calculate Order Total
    • Place Order
    • Add menu_item to order
  Order_Item
    • 
  Product
    • Add products to order_item
    • Create product 
    • Set quantity
    • Decrement quantity
  Shipment
    • Finalize shipment
    • Edit shipment quantity
    • Add product to shipment
*/
