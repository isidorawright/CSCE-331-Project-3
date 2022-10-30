import { Serializable } from "./serializable";

interface IMenuCategory {
  id: number;
  name: string;
}

export class MenuCategory extends Serializable implements IMenuCategory {
  id = -1;
  name = "";
  constructor(data?: IMenuCategory) {
    super(data);
  }
  public fromJson(json: IMenuCategory) {
    if (typeof json === undefined) {
      return this;
    }
    this.id = json.id;
    this.name = json.name;
    return this;
  }
}

interface IMenu {
  categories: MenuCategory[];
}

export class Menu extends Serializable implements IMenu {
  categories: MenuCategory[] = [];
  constructor(data?: IMenu) {
    super(data);
  }
  public fromJson(json: IMenu): this {
    if (json.categories) {
      this.categories = json.categories.map((c) => MenuCategory.fromJson(c));
    }
    return this;
  }
}
