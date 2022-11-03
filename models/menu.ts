export interface IMenuCategory {
  id: number;
  name: string;
  active: boolean;
}

export class MenuCategory implements IMenuCategory {
  id = -1;
  name = "";

  // local props
  active = false;
  menuItemCount = 0;

  constructor(data: IMenuCategory) {
    Object.assign(this, data);
  }
}

export interface IMenu {
  categories: IMenuCategory[];
}

export class Menu implements IMenu {
  categories: MenuCategory[] = [];

  constructor({ categories }: IMenu) {
    categories = categories.map((c) => new MenuCategory(c));
    Object.assign(this, { categories });
  }

  static empty() {
    return new Menu({ categories: [] });
  }
}
