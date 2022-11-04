import { IMenuItem, MenuItem } from "./menuItem";

export interface IMenuCategory {
  id: number;
  name: string;
  active: boolean;
  menuItems: IMenuItem[];
}

export class MenuCategory implements IMenuCategory {
  id = -1;
  name = "";

  menuItems: IMenuItem[] = [];

  // local props
  active = false;
  menuItemCount = 0;

  constructor(data: IMenuCategory, omit?: string[]) {
    Object.assign(this, data);
    // potential recursive reference
    if (!omit || !omit.includes("menuItems")) {
      this.menuItems = data.menuItems.map((m) => new MenuItem(m, ["category"]));
    }
  }
}

export interface IMenu {
  categories: IMenuCategory[];
}

export class Menu implements IMenu {
  categories: MenuCategory[] = [];

  constructor(data: IMenu) {
    Object.assign(this, data);
    this.categories = data.categories.map((c) => new MenuCategory(c));
  }

  static empty() {
    return new Menu({ categories: [] });
  }
}
