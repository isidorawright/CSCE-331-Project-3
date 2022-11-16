import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IShipment, Shipment } from "./shipment";
import { Product, IProduct } from "./product";
import { User, IUser } from "./customer";

export namespace api {
  export async function getMenuCategories(): Promise<IMenuCategory[]> {
    const response = await fetch("/api/menu/categories");
    const json = await response.json();
    return json.items.map((c: IMenuCategory) => MenuCategory(c));
  }
  export async function getProducts(): Promise<IProduct[]> {
    const response = await fetch("/api/menu/products");
    const json = await response.json();
    return json.items.map((p: IProduct) => Product(p));
  }
  export async function getMenu(): Promise<IMenu> {
    const response = await fetch("/api/menus");
    const json = await response.json();

    return Menu(json);
  }
  export namespace category {
    export async function find(id: number): Promise<IMenuCategory> {
      const response = await fetch(`/api/menu/category/${id}`);
      const json = await response.json();
      // it doesnt matter here but if a type contains other types then do it this way
      return MenuCategory(json);
    }
  }
  /*export async function getUser(): Promise<> {
    const response = await fetch("api/user");
    const json = await response.json;
    return json.items.map((u: ))
  }*/

  export namespace shipment {
    export async function fulfill(shipment: IShipment): Promise<Response> {
      return await fetch(`/api/shipment/${shipment.shipmentId}/fulfill/`);
    }
  }

  export namespace user {
    export async function login(
      email: string,
      password: string
    ): Promise<IUser> {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      return User(json);
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
