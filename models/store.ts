import { createModel, Models } from "@rematch/core";
import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import { flow, once } from "lodash";
import { api } from "./api";
import { User, IUser } from "./customer";
import { IMenu, IMenuCategory, Menu, MenuCategory } from "./menu";
import { IMenuItem, MenuItem } from "./menuItem";
import { IOrder, Order } from "./order";
import { OrderItem } from "./orderItem";
import { IProduct, Product } from "./product";

export interface UserLoginInfo {
  email: string;
  password: string;
}

export const customerState = createModel<RootModel>()({
  state: User(),
  reducers: {
    replace(state, payload: IUser) {
      return { ...payload };
    },
  },
  effects: (dispatch) => ({
    login(data: UserLoginInfo) {
      api.user
        .login(data.email, data.password)
        .then(dispatch.customer.replace)
        .catch((err) => console.error(err));
    },
  }),
});

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

interface AppState{
  highContrastTheme: boolean;
}

export const appState = createModel<RootModel>()({
  state: {} as AppState,
  reducers: {
    toggleTheme(state){
      return(
        {...state, highContrastTheme: !state.highContrastTheme}
      )
    }
  },
  effects: (dispatch) => ({})
})

export interface RootModel extends Models<RootModel> {
  // moisture: typeof moisture;
  drawer: typeof drawerState;
  menu: typeof menuState;
  order: typeof orderState;
  app: typeof appState;
}

export const models: RootModel = {
  drawer: drawerState,
  menu: menuState,
  order: orderState,
  customer: customerState,
  app: appState,
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
}

export const initializeStore = once(_initializeStore);
