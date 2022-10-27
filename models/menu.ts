export class MenuCategory {
  id: number = -1;
  name: string = "";
  constructor() {}
}

export class Menu {
  categories: MenuCategory[] = [];
  constructor() {}
}
