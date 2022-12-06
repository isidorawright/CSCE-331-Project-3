import { createModel, Models } from "@rematch/core";
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { once } from "lodash";
import { api } from "./api";
import { User, IUser, UserRole } from "./user";
import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IMenuItem, MenuItem } from "./menuItem";
import { IOrder, Order } from "./order";
import { OrderItem } from "./orderItem";
import { IProduct, Product } from "./product";
import Router from "next/router";
import { IExcess } from "./excess";
import { ISales } from "./sales";
import { IRestock } from "./restock";
import { IPair } from "./pair";
import { IShipment } from "./shipment";
import { AlertColor } from "@mui/material";

/**
 * The store.ts document creates all the root models for the website
 */
export interface drawerState {
  open: boolean;
}

export const drawerState = createModel<RootModel>()({
  state: {
    open: false,
  } as drawerState, // initial state
  reducers: {
    /**
     * This handles state changes with pure functions
     */
    toggle(state) {
      return { ...state, open: !state.open };
    },
    close(state) {
      return { ...state, open: false };
    },
    open(state) {
      return { ...state, open: true };
    },
  },
  effects: (dispatch) => ({}),
});

/**
 * Handles the changes for the menu, menu items,cmenu categories, and the products for each one
 * @return payload
 * @return state
 * @return c, which is the category
 * @retun categories array
 */
export const menuState = createModel<RootModel>()({
  state: Menu(), // initial state
  reducers: {
    replace(state, payload: IMenu) {
      return payload;
    },
    reset(state) {
      Menu.resetSelections(state);
      return { ...state };
    },
    selectCategory(state, payload: IMenuCategory) {
      return {
        ...state,
        categories: state.categories.map((c) => {
          c.active = c.name === payload.name;
          return { ...c };
        }),
      };
    },
    selectItem(state, payload: IMenuItem) {
      const cat = Menu.activeCategory(state);
      if (cat) {
        cat.menuItems.forEach((m) => (m.active = m.id === payload.id));
      }
      return {
        ...state,
        categories: [...state.categories],
      };
    },
    toggleMenuItemProduct(state, product: IProduct) {
      const cat = Menu.activeCategory(state);
      if (!cat) return state;

      const item = MenuCategory.activeItem(cat);
      if (!item) return state;

      const index = item.products.findIndex((p) => p.id === product.id);
      if (index == -1) return state;

      item.products[index].selected = !item.products[index].selected;

      return {
        ...state,
      };
    },
  },
  /**
   * Calls the api and replaces the old with the new
   * @param dispatch
   */
  effects: (dispatch) => ({
    async load() {
      const menu = await api.getMenu();
      dispatch.menu.replace(menu);
    },
  }),
});

/**
 * Handles the changes for orders activities
 * @return payload
 * @return state for orders and menu items
 * @return item, which is the menu item selected
 * @retun order items array
 */
export const orderState = createModel<RootModel>()({
  state: Order(),
  reducers: {
    replace(state, payload: IOrder) {
      return payload;
    },
    reset(state) {
      return Order();
    },
    addItem(state, menuItem: IMenuItem | undefined) {
      if (!menuItem) return state;

      Order.addItem(
        state,
        OrderItem({
          menuItem: MenuItem(menuItem),
          orderId: -1,
          menuItemId: menuItem.id,
          quantity: 1,
          isDrink: false,
          products: menuItem.products
            .filter((p) => p.selected || !p.optional)
            .map((p) => Product(p)),
          id: new Date().getTime(),
        })
      );

      return state;
    },
    toggleSelectOrderItem(state, id: number) {
      return {
        ...state,
        orderItems: state.orderItems.map((item) => {
          item.selected = item.id == id ? !item.selected : item.selected;

          return item;
        }),
      };
    },
    removeItems(state) {
      return {
        ...state,
        orderItems: state.orderItems.filter((item) => !item.selected),
      };
    },
    calculateTotals(state) {
      Order.calculateTotals(state);
      return {
        ...state,
      };
    },
  },
  /**
   * Updates the changes as well as notifies the user that an oder was placed successfully
   * @param dispatch
   */
  effects: (dispatch) => ({
    async submit(order: IOrder) {
      await api.order.submit(order);
      dispatch.menu.reset();
      dispatch.order.reset();
      dispatch.notifications.setMessage({
        message: "Order Placed",
        severity: "success",
      });
      dispatch.notifications.setOpen(true);
    },
  }),
});

interface UserState {
  loggedIn: boolean;
  user: IUser;
  manager: boolean;
  error: string;
}
/**
 * Handles the changes for user activities
 * @return payload/user
 * @return state
 * @return loggedin. boolean true or false
 * @retun manager. This sets manager roles that allows for admin access
 * @return error. An error message is user tries to access manager roles
 */
export const userState = createModel<RootModel>()({
  state: {
    user: User(),
    loggedIn: false,
    manager: false,
    error: "",
  } as UserState,
  reducers: {
    replace(state, payload: UserState) {
      return payload;
    },
    updateUser(state, payload: IUser) {
      return {
        ...state,
        user: payload,
        loggedIn: true,
        manager: payload.role === UserRole.MANAGER,
      };
    },
    setError(state, payload: string) {
      return { ...state, error: payload };
    },
  },
  effects: (dispatch) => ({
    /**
     * @param data
     */
    async login(data: IUser) {
      if (!data.password) {
        throw new Error("Password is required");
      }

      await api.user.login(data.username, data.password).then((user) => {
        dispatch.user.replace({
          user,
          loggedIn: true,
          manager: data.role == UserRole.MANAGER ? true : false,
          error: "",
        });
      });

      if (store.getState().role == UserRole.MANAGER) {
        Router.push("/manager");
      } else {
        Router.push("/order");
      }
    },
    async logout() {
      await api.user.logout().then(() => {
        dispatch.user.replace({
          user: User(),
          loggedIn: false,
          manager: false,
          error: "",
        });
      });
      Router.push("/login");
    },
    /**
     * @param data
     */
    async register(data: IUser) {
      if (!data.password) return;
      await api.user.register(data.username, data.password).then((user) => {
        dispatch.user.replace({
          user,
          loggedIn: true,
          manager: data.role == UserRole.MANAGER ? true : false,
          error: "",
        });
      });
      Router.push("/order");
    },
    async fetch() {
      // get the current user if they have a session
      try {
        let user = await api.user.fetchAccount();
        dispatch.user.updateUser(user);
      } catch (e) {
        // user not logged in, do nothing
      }
    },
    /**
     * @param response
     */
    async handleOAuth(response) {
      try {
        let user = await api.user.verifyOauthToken(response.credential);
        dispatch.user.updateUser(user);
        if (user.role == UserRole.MANAGER) {
          Router.push("/manager");
        } else {
          Router.push("/order");
        }
      } catch (e) {
        dispatch.user.setError("Error logging in");
      }
    },
  }),
});

interface NotificationState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

/**
 * Handles the changes for notification activities
 * @return state
 * @return open/payload
 * @retun message
 * @return severity of message
 */
export const notificationState = createModel<RootModel>()({
  state: {
    open: false,
    message: "",
    severity: "info",
  } as NotificationState,
  reducers: {
    setOpen(state, payload: boolean) {
      return {
        ...state,
        open: payload,
      };
    },
    setMessage(state, payload) {
      return {
        ...state,
        message: payload.message,
        severity: payload.severity,
      };
    },
  },
});

interface ManagerState {
  menuItems: IMenuItem[];
  inventory: IProduct[];
  excess: IExcess[];
  sales: ISales[];
  restock: IRestock[];
  pairs: IPair[];
  orders: IOrder[];
  shipments: IShipment[];
}

/**
 * Handles the changes for manager activities
 * @return payload
 */
export const managerState = createModel<RootModel>()({
  state: {
    inventory: [],
    menuItems: [],
    orders: [],
    excess: [],
    sales: [],
    pairs: [],
    restock: [],
    shipments: [],
  } as ManagerState,
  reducers: {
    replace(state, payload: ManagerState) {
      return payload;
    },
    assign(state, payload : Partial<ManagerState>) {
      return {...state, ...payload}
    },
  },
  effects: (dispatch) => ({
    async setSalesReport({
        start,
        end,
      } : {
        start : String;
        end : String;
      }) {
      const sales = await api.reports.sales(start, end);
      dispatch.manager.assign({sales});
    },
    async setExcessReport({
      end,
    } : {
      end : String;
    }) {
    const excess = await api.reports.excess(end);
    dispatch.manager.assign({excess});
  },
  async setPairReport({
    start,
    end,
  } : {
    start : String;
    end : String;
  }) {
  const pairs = await api.reports.pairs(start, end);
  dispatch.manager.assign({pairs});
},
    async fetch() {
      const [
        products,
        menuItems,
        orders,
        excessItems,
        salesItems,
        restockItems,
        pairsItems,
        shipments,
      ] = await Promise.all([
        api.product.getAll(),
        api.menu.getMenuItems(),
        api.order.getAllOrders(),
        api.reports.excess("01-01-20"),
        api.reports.sales("08-04-22", "01-01-23"),
        api.reports.restock(),
        api.reports.pairs("08-04-22", "01-01-23"),
        api.shipment.getAllShipments(),
      ]);
      dispatch.manager.replace({
        inventory: products,
        menuItems,
        orders,
        excess: excessItems,
        sales: salesItems,
        restock: restockItems,
        pairs: pairsItems,
        shipments,
      });
    },
  }),
});

export enum ModalType {
  checkout = "checkout",
}

export interface ModalState {
  type: ModalType;
  open: boolean;
}

export const modalState = createModel<RootModel>()({
  state: {
    type: ModalType.checkout,
    open: false,
  } as ModalState,
  reducers: {
    setType(state, type: ModalType) {
      return {
        ...state,
        type,
      };
    },
    setOpen(state, open: boolean) {
      return {
        ...state,
        open,
      };
    },
  },
});

export interface RootModel extends Models<RootModel> {
  drawer: typeof drawerState;
  menu: typeof menuState;
  order: typeof orderState;
  user: typeof userState;
  manager: typeof managerState;
  notifications: typeof notificationState;
  modal: typeof modalState;
}

export const models: RootModel = {
  drawer: drawerState,
  menu: menuState,
  order: orderState,
  user: userState,
  manager: managerState,
  notifications: notificationState,
  modal: modalState,
};

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

if (typeof window !== "undefined") {
  (window as any).store = store;
}

export default store;

function initializeOauth() {
  try {
    (window as any).google.accounts.id.initialize({
      client_id:
        "716768877261-d2d45v249dmtr6adj9edo3uran066k2k.apps.googleusercontent.com",
      callback: store.dispatch.user.handleOAuth,
    });
    if (!store.getState().user.loggedIn) {
      (window as any).google.accounts.id.prompt();
    }
  } catch (e) {}
}

let googleTranslateElementInit = once(() => {
  try {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: "en",
        layout: (window as any).google.translate.TranslateElement.InlineLayout
          .SIMPLE,
      },
      "google_translate_element"
    );
  } catch (e) {
    console.error(e);
  }
});

function _initializeStore(store: Store) {
  Promise.all([
    store.dispatch.menu.load().catch((e) => {}),
    store.dispatch.manager.fetch().catch((e) => {}),
    store.dispatch.user.fetch().catch((e) => {}),
  ]);

  if (typeof window !== "undefined") {
    if ((window as any).google) {
      initializeOauth();
      googleTranslateElementInit();
    } else {
      const gsiClient = document.getElementById("gsi-client");
      if (gsiClient) {
        gsiClient.addEventListener("load", () => {
          initializeOauth();
          googleTranslateElementInit();
        });
      }
    }
  }
}

export const initializeStore = once(_initializeStore);
