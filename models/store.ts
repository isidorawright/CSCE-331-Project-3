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

export interface drawerState {
  open: boolean;
}

export const drawerState = createModel<RootModel>()({
  state: {
    open: false,
  } as drawerState, // initial state
  reducers: {
    // handle state changes with pure functions
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
  effects: (dispatch) => ({
    async load() {
      const menu = await api.getMenu();
      dispatch.menu.replace(menu);
    },
  }),
});

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
            .filter((p) => p.selected)
            .map((p) => Product(p)),
          id: -1,
        })
      );

      return state;
    },
  },
  effects: (dispatch) => ({
    async submit(order: IOrder) {
      await api.order.submit(order);
      dispatch.menu.reset();
      dispatch.order.reset();
    },
  }),
});

interface UserState {
  loggedIn: boolean;
  user: IUser;
  manager: boolean;
}

export const userState = createModel<RootModel>()({
  state: {
    user: User(),
    loggedIn: false,
    manager: false,
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
  },
  effects: (dispatch) => ({
    async login(data: IUser) {
      if (!data.password) {
        throw new Error("Password is required");
      }

      await api.user.login(data.username, data.password).then((user) => {
        dispatch.user.replace({
          user,
          loggedIn: true,
          manager: data.role == UserRole.MANAGER ? true : false,
        });
      });

      if (store.getState().manager) {
        Router.push("/manager");
        Router.push("/report");
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
        });
      });
      Router.push("/login");
    },
    async register(data: IUser) {
      if (!data.password) return;
      await api.user.register(data.username, data.password).then((user) => {
        dispatch.user.replace({
          user,
          loggedIn: true,
          manager: data.role == UserRole.MANAGER ? true : false,
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
  }),
});

interface ManagerState {
  menuItems: IMenuItem[];
  inventory: IProduct[];
  excess: IExcess[];
  sales: ISales[];
  restock: IRestock[];
  pairs: IPair[];
}

export const managerState = createModel<RootModel>()({
  state: {
    inventory: [],
    menuItems: [],
    excess: [],
    sales: [],
    pairs: [],
    restock: [],
  } as ManagerState,
  reducers: {
    setInventory(state, payload: IProduct[]) {
      return {
        ...state,
        inventory: payload,
      };
    },
    setMenuItems(state, payload: IMenuItem[]) {
      return {
        ...state,
        menuItems: payload,
      };
    },
    setExcess(state, payload: IExcess[]) {
      return {
        ...state,
        excess: payload
      }
    },
    setSale(state, payload: ISales[]) {
      return {
        ...state,
        sales: payload
      }
    },
    setRestock(state, payload: IRestock[]) {
      return {
        ...state,
        restock: payload
      }
    },
    setPairs(state, payload: IPair[]) {
      return {
        ...state,
        pairs: payload
      }
    }
  },
  effects: (dispatch) => ({
    async fetch() {
      const products = await api.product.getAll();
      dispatch.manager.setInventory(products);

      const menuItems = await api.menu.getMenuItems();
      dispatch.manager.setMenuItems(menuItems);

      const excessItems = await api.reports.excess("01-01-20");
      dispatch.manager.setExcess(excessItems);

      const salesItems = await api.reports.sales("08-04-22", "01-01-23");
      dispatch.manager.setSale(salesItems);

      const restockItems = await api.reports.restock();
      dispatch.manager.setRestock(restockItems);

      const pairsItems = await api.reports.pairs("08-04-22", "01-01-23");
      dispatch.manager.setPairs(pairsItems);
    },
  }),
});

export interface RootModel extends Models<RootModel> {
  drawer: typeof drawerState;
  menu: typeof menuState;
  order: typeof orderState;
  user: typeof userState;
  manager: typeof managerState;
}

export const models: RootModel = {
  drawer: drawerState,
  menu: menuState,
  order: orderState,
  user: userState,
  manager: managerState,
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

function _initializeStore(store: Store) {
  store.dispatch.menu.load();
  store.dispatch.manager.fetch();
  store.dispatch.user.fetch();
}

export const initializeStore = once(_initializeStore);
