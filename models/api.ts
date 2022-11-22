import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IShipment, Shipment } from "./shipment";
import { Product, IProduct } from "./product";
import { User, IUser } from "./user";
import { IOrder } from "./order";

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
  export namespace product {
    export async function insert(product: IProduct): Promise<IProduct> {
      const response = await fetch("/api/menu/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const { id } = await response.json();
      product.id = id;
      return product;
    }
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

  export namespace user {
    export async function login(
      username: string,
      password: string
    ): Promise<IUser> {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status != 200) {
        throw new Error("Invalid username or password");
      }
      const json = await response.json();
      return User(json);
    }
    export async function register(
      username: string,
      password: string
    ): Promise<IUser> {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status != 200) {
        let text = await response.text();
        throw new Error(text);
      }
      const json = await response.json();
      return User(json);
    }
    export async function logout(): Promise<void> {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status != 200) {
        let text = await response.text();
        throw new Error(text);
      }
      return;
    }
  }

  export namespace shipment {

    export async function getShipment() {
      const response = await fetch(`/api/shipment/`, {method : 'GET'});
      return response;
    }
    export async function postShipment(shipment: IShipment) {
      const response = await fetch(`/api/shipment/${shipment.shipmentId}`, {method : 'POST'});
    }
    export async function pushShipment(shipment: IShipment) {
      const response = await fetch(`/api/shipment/${shipment.shipmentId}`, {method : 'POST'});
    }
    export async function deleteShipment(shipment: IShipment) {
      const response = await fetch(`/api/shipment/${shipment.shipmentId}`, {method : 'POST'});
    }


    export async function fulfill(shipment: IShipment) {
      await fetch(`/api/shipment/${shipment.shipmentId}/fulfill/`);
    }
    export async function addProduct(
      shipment: IShipment,
      product: IProduct,
      quantity: number
    ) {
      await fetch(
        `/api/shipment/${shipment.shipmentId}/addProduct/?productId=${product.id}&quantity=${quantity}`
      );
    }
    export async function setQuantity(
      shipment: IShipment,
      product: IProduct,
      quantity: number
    ) {
      await fetch(
        `/api/shipment/${shipment.shipmentId}/setQuantity/?productId=${product.id}&quantity=${quantity}`
      );
    }
    }
  }

  export namespace order {
    export async function submit(order: IOrder) {
      await fetch("/api/order/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
    }
  }

if (typeof window !== "undefined") {
  (window as any).api = api;
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


  Shipment:
    shipment
      {
        GET   Get all shipments view
      }
    shipment/[shipmentId]/
      {
        GET     Get Shipment object (date, fulfilled, product)
        POST    Create new shipment (date, fulfilled)
        PUT     Update shipment (date, fulfilled, (need to pass in products?))
        DELETE  Remove shipment (cascade delete products in shipment)
      }
    shipment/[shipmentId]/product/[productId]
      {
        GET     Get quantity
        POST    create new product in a given shipment
        PUT     update product quantity
        DELETE  remove product in shipment
      }
*/
