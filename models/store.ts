import { createModel, Models } from "@rematch/core";
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { flow, once } from "lodash";
import { api } from "./api";
import { User, IUser } from "./user";
import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IMenuItem, MenuItem } from "./menuItem";
import { IOrder, Order } from "./order";
import { OrderItem } from "./orderItem";
import { IProduct, Product } from "./product";
import Router from "next/router";

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
}

export const userState = createModel<RootModel>()({
  state: {
    user: User(),
    loggedIn: false,
  } as UserState,
  reducers: {
    replace(state, payload: UserState) {
      return payload;
    },
  },
  effects: (dispatch) => ({
    async login(data: IUser) {
      if (!data.password) return;
      await api.user
        .login(data.username, data.password)
        .then((user) => {
          dispatch.user.replace({
            user,
            loggedIn: true,
          });
        })
        .catch((err) => console.error(err));
      Router.push("/");
    },
    async logout() {
      await api.user.logout().then(() => {
        dispatch.user.replace({
          user: User(),
          loggedIn: false,
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
        });
      });
      Router.push("/");
    },
  }),
});

interface ManagerState {
  menuItems: IMenuItem[];
  inventory: IProduct[];
}

export const managerState = createModel<RootModel>()({
  state: {
    inventory: [],
    menuItems: []
  } as ManagerState,
  reducers: {
    setInventory(state, payload: IProduct[]) {
      return {
        ...state,
        inventory: payload
      }
    },
    setMenuItems(state, payload: IMenuItem[]) {
      return {
        ...state,
        menuItems: payload
      }
    }
  },
  effects: (dispatch) => ({
    async fetch() {
      const products = await api.product.getAll();
      dispatch.manager.setInventory(products);

      const menuItems = await api.menu.getMenuItems();
      dispatch.manager.setMenuItems(menuItems);
    }
  })
})

export interface RootModel extends Models<RootModel> {
  // moisture: typeof moisture;
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
  manager: managerState
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
}

export const initializeStore = once(_initializeStore);
