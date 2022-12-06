import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { Product, IProduct } from "./product";
import { User, IUser } from "./user";
import { IOrder } from "./order";
import { IMenuItem } from "./menuItem";
import { IExcess, Excess } from "./excess";
import { ISales, Sale } from "./sales";
import { IRestock, Restock } from "./restock";
import { IPair, Pair } from "./pair";
import { IShipment, Shipment } from "./shipment";

/**
 * This document is to call the different api's
 */

export namespace api {
  /**
   * Calls api to get the menu item categories
   */
  export async function getMenuCategories(): Promise<IMenuCategory[]> {
    const response = await fetch("/api/menu/categories");
    const json = await response.json();
    return json.items.map((c: IMenuCategory) => MenuCategory(c));
  }

  /**
   * Calls api to get the products
   * @return products array
   */
  export async function getProducts(): Promise<IProduct[]> {
    const response = await fetch("/api/menu/products");
    const json = await response.json();
    return json.items.map((p: IProduct) => Product(p));
  }
  /**
   * Calls api to get the menu (menu item along with the prices)
   */
  export async function getMenu(): Promise<IMenu> {
    const response = await fetch("/api/menus");
    const json = await response.json();

    return Menu(json);
  }
  /**
   * Calls api for product related activity
   */
  export namespace product {
  /**
   * Calls api to insert a product into the product array
   * @return product from the product id
   */
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
  /**
   * Calls api to get all the products in stock
   * @return product id
   * @return product type
   * @return quantity in stock
   * @retun conversion factor
   * @return product type id
   */
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
  /**
   * Calls api to update the quantity in inventory
   */
    export async function updateQuantity(name: String, quantity: number) {
      const response = await fetch(`/api/product/?quantity=${quantity}&productName=${name}`, {method: "PUT"});
    }
  }
  /**
   * Calls api to get menu items
   * @return menu item id
   * @return menu item price
   */
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
  /**
   * Calls api to create a new menu item
   * @param name
   * @param price
   * @return response from json
   */
    export async function createMenuItem(
      name: String,
      price: String
    ) {
      const response = await fetch(
        `/api/menuItem/?itemName=${name}&itemPrice=${price}`,
        { method: "POST" }
      );
      return await response.json();
    }
  /**
   * Calls api to update the menu item price
   * @param name
   * @param price
   */
    export async function updateMenuItemPrice(
      name: String,
      price: String
    ) {
      const response = await fetch(
        `/api/menuItem/?itemName=${name}&itemPrice=${price}`,
        { method: "PUT" }
      );
      return await response.json();
    }
  }
  /**
   * Calls api to get menu categories
   * @param id
   * @return menu item categories
   */
  export namespace category {
    export async function find(id: number): Promise<IMenuCategory> {
      const response = await fetch(`/api/menu/category/${id}`);
      const json = await response.json();
      // it doesnt matter here but if a type contains other types then do it this way
      return MenuCategory(json);
    }
  }
  /**
   * Calls api to verify user credentials
   * @param credential
   */
  export namespace user {
    export async function verifyOauthToken(credential: string): Promise<IUser> {
      const response = await fetch(
        "/api/user/verifyOauthToken?credential=" + credential
      );
      const json = await response.json();
      return User(json);
    }
   /**
   * Calls api to allow a user to login. If invalid, then print a message. If valid, allows access.
   * @param username
   * @param password
   */
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
  /**
   * Calls api to allow a user to register a manager account
   * @param username
   * @param password
   */
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
  /**
   * Calls api to logout of system
   */
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
  /**
   * Calls api to fetch the account of a user
   */
    export async function fetchAccount(): Promise<IUser> {
      const response = await fetch("/api/user/current");
      const json = await response.json();
      return User(json);
    }
  }
  /**
   * Calls api for all shipment related activities
   */
  export namespace shipment {
    // Shipment Collection
  /**
   * Calls api to get all the shipments
   * @return all shipments
   */
    export async function getAllShipments() {
      const response = await fetch(`/api/shipment/`, { method: "GET" });
      return await response.json();
    }
  /**
   * Calls api to create a shipment
   * @param shipmentDate
   * @param fulfilled
   */
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
  /**
   * Calls api to get a specific shipment
   * @param shipmentId
   */
    export async function getShipment(shipmentId: number) {
      const response = await fetch(`/api/shipment/${shipmentId}`, {
        method: "GET",
      });
      return await response.json();
    }
  /**
   * Calls api to update a shipment
   * @param shipmentId
   * @param shipmentDate
   * @param fulfilled
   */
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
  /**
   * Calls api to delete a shipment
   * @param shipmentId
   */
    export async function deleteShipment(shipmentId: number) {
      const response = await fetch(`/api/shipment/${shipmentId}`, {
        method: "DELETE",
      });
      return await response.json();
    }

    // Shipment Products
  /**
   * Calls api to get a product from a specific shipment
   * @param shipmentId
   * @param productId
   */
    export async function getProduct(shipmentId: number, productId: number) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}`,
        { method: "GET" }
      );
      return await response.json();
    }
  /**
   * Calls api to create a product for a shipment
   * @param shipmentId
   * @param productId
   * @param quantity
   */
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
  /**
   * Calls api to update products in shipment
   * @param shipmentId
   * @param productId
   * @param quantity
   */
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
  /**
   * Calls api to delete a product in shipment
   * @param shipmentId
   * @param productId
   */
    export async function deleteProduct(shipmentId: number, productId: number) {
      const response = await fetch(
        `/api/shipment/${shipmentId}/product/${productId}`,
        { method: "DELETE" }
      );
      return await response.json();
    }
  }
  /**
   * Calls api for all the report realted acitivity
   */
  export namespace reports {
  /**
   * Calls api to update products in shipment
   * @return a list of all products and dollar amount sold between startDate and endDate
   * @param startDate
   * @param endDate
   */
    export async function sales(
      startDate: String | Date,
      endDate: String | Date
    ): Promise<ISales[]> {
      const response = await fetch(
        `/api/reports/sales/?startDate=${startDate}&endDate=${endDate}`,
        { method: "GET" }
      );

      const body = (await response.json()) as { [key: string]: string };

      return Object.entries(body).map(([itemName, itemSale]) => {
        return Sale({
          itemName,
          itemSale,
        });
      });
    }
  /**
   * Calls api to update products in shipment
   * @return a list of products whose inventory has fallen below the restock threshold
   */
    export async function restock(): Promise<IRestock[]> {
      const response = await fetch(`/api/reports/restock`, { method: "GET" });

      const body = (await response.json()) as { [key: string]: string };

      return Object.entries(body).map(([restockName, amount]) => {
        return Restock({
          restockName,
          amount,
        });
      });
    }
  /**
   * Calls api to update products in shipment
   * @return a list of products and percent of their invetory sold for products which have sold less than 10% of thier stock up to a given date
   * @param date
   */
    export async function excess(date: String | Date): Promise<IExcess[]> {
      const response = await fetch(`/api/reports/excess/?date=${date}`, {
        method: "GET",
      });

      const body = (await response.json()) as { [key: string]: string };

      return Object.entries(body).map(([productName, percentSold]) => {
        return Excess({
          productName,
          percentSold,
        });
      });
    }
  /**
   * Calls api to update products in shipment
   * @return a list of all menu items which commonly sold together between startDate and endDate, along with the frequency of these combinations
   * @param startDate
   * @param endDate
   */
    export async function pairs(
      startDate: String | Date,
      endDate: String | Date
    ): Promise<IPair[]> {
      const response = await fetch(
        `/api/reports/pairs/?startDate=${startDate}&endDate=${endDate}`,
        { method: "GET" }
      );

      const body = (await response.json()) as { [key: string]: string };

      return Object.entries(body).map(([pairName, pairFrequency]) => {
        return Pair({
          pairName,
          pairFrequency,
        });
      });
    }
  }
  /**
   * Calls api related to all order functionality
   */
  export namespace order {
  /**
   * Calls api to submit an order
   * @param order
   */
    export async function submit(order: IOrder) {
      await fetch("/api/order/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });
    }
  /**
   * Calls api to get all orders
   * @return order id
   * @return order date
   * @return order total
   * @return count
   */
    export async function getAllOrders(): Promise<IOrder[]> {
      const response = await fetch("/api/order");
      const body = await response.json();

      return body.map((order: any) => {
        return {
          id: order.order_id,
          orderDate: order.order_date.substring(0, 10),
          orderTotal: order.order_total,
          totalItems: order.count,
        };
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
