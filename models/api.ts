import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IShipment, Shipment } from "./shipment";
import { Product, IProduct } from "./product";
import { User, IUser } from "./user";
import { IOrder } from "./order";
import { IMenuItem } from "./menuItem";
import { IExcess, Excess } from "./excess";

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
    export async function getAll(): Promise<IProduct[]> {
      const response = await fetch("/api/product");
      const body = await response.json();

      return body.map((product: any) => {
        return {
          id: product.product_id,
          productName: product.product_name,
          productType: product.product_type_name,
          quantityInStock: product.quantity_in_stock,
          conversionFactor: product.conversion_factor,
          productTypeId: product.product_type_id,
        };
      });
    }
  }
  export namespace menu {
    export async function getMenuItems(): Promise<IMenuItem[]> {
      const response = await fetch("/api/menuItem");
      const body = await response.json();

      return body.map((item: any) => {
        return {
          id: item.menu_item_id,
          name: item.item_name,
          price: item.menu_item_price,
          configurable: item.configurable,
          category: null,
          products: null,
        };
      });
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
    export async function fetchAccount(): Promise<IUser> {
      const response = await fetch("/api/user/current");
      const json = await response.json();
      return User(json);
    }
  }

  export namespace shipment {
    // Shipment Collection
    export async function getAllShipments() {
      const response = await fetch(`/api/shipment/`, { method: "GET" });
      return await response.json();
    }
    export async function createShipment(
      shipmentDate: String | Date,
      fulfilled: boolean
    ) {
      const response = await fetch(
        `/api/shipment/?shipmentDate='${shipmentDate}'&fulfilled=${fulfilled}`,
        { method: "POST" }
      );
      return await response.json();
    }

    // Indiviudal Shipments
    export async function getShipment(shipmentId: number) {
      const response = await fetch(`/api/shipment/${shipmentId}`, {
        method: "GET",
      });
      return await response.json();
    }
    export async function updateShipment(
      shipmentId: number,
      shipmentDate: String | Date,
      fulfilled: boolean
    ) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/?fulfilled=${fulfilled}&shipmentDate='${shipmentDate}'`,
        { method: "PUT" }
      );
      return await response.json();
    }
    export async function deleteShipment(shipmentId: number) {
      const response = await fetch(`/api/shipment/${shipmentId}`, {
        method: "DELETE",
      });
      return await response.json();
    }

    // Shipment Products
    export async function getProduct(shipmentId: number, productId: number) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}`,
        { method: "GET" }
      );
      return await response.json();
    }
    export async function createProduct(
      shipmentId: number,
      productId: number,
      quantity: number
    ) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}/?quantity=${quantity}`,
        { method: "POST" }
      );
      return await response.json();
    }
    export async function updateProduct(
      shipmentId: number,
      productId: number,
      quantity: number
    ) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}/?quantity=${quantity}`,
        { method: "PUT" }
      );
      return await response.json();
    }
    export async function deleteProduct(shipmentId: number, productId: number) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}`,
        { method: "DELETE" }
      );
      return await response.json();
    }
  }

  export namespace reports {
    // Returns a list of all products and dollar amount sold between startDate and endDate
    export async function sales(
      startDate: String | Date,
      endDate: String | Date
    ) {
      const response = await fetch(
        `/api/reports/sales/?startDate='${startDate}'&endDate='${endDate}'`,
        { method: "GET" }
      );
      return response.json();
    }
    // Returns a list of products whose inventory has fallen below the restock threshold
    export async function restock() {
      return await fetch(`/api/reports/restock`, { method: "GET" });
    }
    // Returns list of products and percent of their invetory sold for products which have sold less than 10% of thier stock up to a given date
    export async function excess(date: String | Date): Promise<IExcess[]> {
      const response = await fetch(`/api/reports/excess/?date=${date}`, {
        method: "GET",
      });
      //return response.json();

      const body = await response.json() as {[key: string]: string};

      // {"Fountain Drink":"0.002%","Bottled Beverage":"0.006%","Gatorade":"0.002%","Cauliflower":"0.014%","Standard":"0.018%","Alfredo":"0.016%","Traditional Red":"0.016%","Zesty Red":"0.022%","House Blend":"0.01%","Parmesan":"0.018%","BBQ Sauce":"0.016%","Olive Oil":"0.008%","Oregano":"0.008%","Ranch":"0.006%","Sriracha":"0.002%","Diced Ham":"0.004%","Salami":"0.006%","Black Olives":"0.004%","Green Peppers":"0.004%","Onions":"0.004%","Pineapple":"0.004%"}

      return(
        Object.entries(body).map(([productName, percentSold]) => {
          return Excess({
            productName,
            percentSold
          })
        })
      )
    }
    // Returns a list of all menu items which commonly sold together between startDate and endDate, along with the frequency of these combinations
    export async function pairs(
      startDate: String | Date,
      endDate: String | Date
    ) {
      const response = await fetch(
        `/api/reports/pairs/?startDate='${startDate}'&endDate='${endDate}'`,
        { method: "GET" }
      );
      return response.json();
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
}

if (typeof window !== "undefined") {
  (window as any).api = api;
}

/*
  Shipment:

    Routes:
    - shipment/                                       (Collection of shipments, i.e. table)
    - shipment/[shipmentId]                           (Individual Shipment)
    - shipment/[shipmentId]/product/[productId]       (Individual product in a shipment)
    
    Methods:
      shipment    
      {
        GetAllShipments()     GET     Get all shipments view JSON
        CreateShipment()      POST    Create new shipment (date, fulfilled)
      }
      shipment/[shipmentId]/    
      {
        GetShipment()         GET     Get Shipment object JSON (date, fulfilled, product)
        UpdateShipment()      PUT     Update shipment (date, fulfilled)                   **Does not update products, use product route for that**
        DeleteShipment()      DELETE  Remove shipment                                     ** Does not remove products in a shipment, use product route for that **
      }
      shipment/[shipmentId]/product/[productId]     
      {
        getProduct()          GET     Get product quantity in a given shipment
        createProduct()       POST    create new product in a given shipment
        updateProduct         PUT     Update product quantity in a given shipment
        deleteProduct         DELETE  Remove product in a given shipment
      }

  Reports:

    Routes:
      - api/reports/excess/?date='${date}'
      - api/reports/pairs/?startDate='${startDate}'&endDate='${endDate}'
      - api/reports/restock
      - api/reports/sales/?startDate='${startDate}'&endDate='${endDate}'


  TODO Routes:
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
