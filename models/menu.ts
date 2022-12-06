import { IMenuItem, MenuItem } from "./menuItem";

export interface IMenuCategory {
  id: number;
  name: string;
  menuItems: IMenuItem[];

  active?: boolean;
  menuItemCount?: number;
}

 /**
  * Returns the category of a product
  * @return the menu category of a product or null if it does not exist
  */
export function MenuCategory(
  category?: IMenuCategory,
  omit?: string[]
): IMenuCategory {
  if (category) {
    if (!omit || !omit.includes("menuItems")) {
      category.menuItems = category.menuItems.map((m) => MenuItem(m));
    }
    return category;
  }
  return { id: -1, name: "", menuItems: [] };
}

export namespace MenuCategory {
  export function activeItem(
    cat: IMenuCategory | undefined
  ): IMenuItem | undefined {
    if (!cat) return undefined;
    return cat.menuItems.find((m) => m.active);
  }
}

export interface IMenu {
  categories: IMenuCategory[];
  configuringPizza?: boolean;
}

export function Menu(menu?: IMenu): IMenu {
  if (menu) {
    menu.categories = menu.categories.map((c) => MenuCategory(c));
    return menu;
  }
  return { categories: [] };
}

export namespace Menu {
  export function activeCategory(
    menu: IMenu | undefined
  ): IMenuCategory | undefined {
    if (!menu) return undefined;
    return menu.categories.find((c) => c.active);
  }

  export function resetSelections(menu: IMenu | undefined): IMenu | undefined {
    if (!menu) return undefined;
    menu.categories.forEach((c) => {
      c.active = false;
      c.menuItems.forEach((item) => {
        item.active = false;
        item.products.forEach((p) => {
          p.selected = false;
        });
      });
    });
    return menu;
  }
}
