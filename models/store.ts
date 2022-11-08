import { once } from "lodash";
import { merge, BehaviorSubject } from "rxjs";
import { api } from "./api";
import { IMenu, Menu } from "./menu";
import { Order } from "./order";

export namespace Store {
  export interface Drawer {
    open: boolean;
  }
}

class Store {
  drawer = new BehaviorSubject<Store.Drawer>({
    open: false,
  });
  menu = new BehaviorSubject<Menu>(new Menu());
  order = new BehaviorSubject<Order>(new Order());
}

function _initializeStore(store: Store) {
  api.getMenu().then((menu) => store.menu.next(menu));
}

export const initializeStore = once(_initializeStore);

export const store = new Store();

export default store;
