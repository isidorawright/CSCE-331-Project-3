import type { NextApiRequest, NextApiResponse } from "next";
import { Menu, MenuCategory } from "../../models/menu";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  let menu = new Menu({
    categories: [
      new MenuCategory({
        id: 1,
        name: "Pizza",
        active: true,
        menuItems: [
          {
            id: 1,
            name: "Cheese Pizza",
            price: 10.99,
            configurable: true,
            active: false,
            category: {
              id: 1,
              name: "Pizza",
              active: true,
              menuItems: [],
            },
            products: [
              {
                productId: 1,
                productName: "Cheese",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 1,
              },
              {
                productId: 2,
                productName: "Dough",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 2,
              },
            ],
          },
          {
            id: 2,
            name: "Pepperoni Pizza",
            price: 12.99,
            configurable: true,
            active: true,
            category: {
              id: 1,
              name: "Pizza",
              active: true,
              menuItems: [],
            },
            products: [
              {
                productId: 1,
                productName: "Cheese",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 1,
              },
              {
                productId: 2,
                productName: "Dough",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 2,
              },
              {
                productId: 3,
                productName: "Pepperoni",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 3,
              },
            ],
          },
        ],
      }),
      new MenuCategory({
        id: 2,
        name: "Drinks",
        active: false,
        menuItems: [
          {
            id: 3,
            name: "Coke",
            price: 1.99,
            configurable: false,
            category: {
              id: 2,
              name: "Drinks",
              active: false,
              menuItems: [],
            },
            products: [
              {
                productId: 4,
                productName: "Coke",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 4,
              },
            ],
          },
          {
            id: 4,
            name: "Sprite",
            price: 1.99,
            configurable: false,
            category: {
              id: 2,
              name: "Drinks",
              active: false,
              menuItems: [],
            },
            products: [
              {
                productId: 5,
                productName: "Sprite",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 5,
              },
            ],
          },
        ],
      }),
    ],
  });

  res.status(200).json(menu);
}
