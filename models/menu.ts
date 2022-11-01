export interface IMenuCategory {
  id: number;
  name: string;
}

export class MenuCategory implements IMenuCategory {
  id = -1;
  name = "";

  constructor({ id, name }: IMenuCategory) {
    Object.assign(this, { id, name });
  }

  static fromJSON(json: string): MenuCategory {
    const data = JSON.parse(json) as IMenuCategory;

    return new MenuCategory(data);
  }

  toJSON(): string {
    return JSON.stringify(this);
  }
}

export interface IMenu {
  categories: MenuCategory[];
}

export class Menu implements IMenu {
  categories: MenuCategory[] = [];

  constructor({ categories }: IMenu) {
    Object.assign(this, { categories });
  }

  static fromJSON(json: string): Menu {
    const data = JSON.parse(json, (key, value) => {
      if (key == "categories") {
        return (value as IMenuCategory[]).map((c) => new MenuCategory(c));
      }
      return value;
    }) as IMenu;
    return new Menu(data);
  }

  toJSON(): string {
    return JSON.stringify(this);
  }
}
