import { IMenuItem, MenuItem } from "./menuItem";

export interface IMenuCategory {
  id: number;
  name: string;
  menuItems: IMenuItem[];

  active?: boolean;
  menuItemCount?: number;
}

export class MenuCategory implements IMenuCategory {
  id = -1;
  name = "";

  menuItems: IMenuItem[] = [];

  // local props
  active = false;
  menuItemCount = 0;

  activeItem(): IMenuItem | undefined {
    return this.menuItems.find((m) => m.active);
  }

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
  configuringPizza?: boolean;
}

export class Menu implements IMenu {
  categories: MenuCategory[] = [];
  configuringPizza = false;

  activeCategory(): MenuCategory | undefined {
    return this.categories.find((c) => c.active);
  }

  constructor(data?: IMenu) {
    if (data) {
      Object.assign(this, data);
      this.categories = data.categories.map((c) => new MenuCategory(c));
    }
  }

  resetSelections() {
    let cat = this.activeCategory();
    let item = cat?.activeItem();
    if (item) {
      item.products.forEach((p) => (p.selected = false));
      item.active = false;
      if (cat) {
        cat.active = false;
      }
    }
  }
}
