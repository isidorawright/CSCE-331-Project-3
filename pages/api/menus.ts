import { group } from "console";
import _, { groupBy, uniq } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { Menu, MenuCategory } from "../../models/menu";
import { MenuItem } from "../../models/menuItem";
import { Product } from "../../models/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // mock response
  // let menu = new Menu();
  // try {
  //   // get all menu items
  //   const menu_item_rows = await database
  //     .query(`select * from menu_item`)
  //     .then((res) => res.rows);

  //   // group by category
  //   const menuItemByCategoryId = groupBy(
  //     menu_item_rows,
  //     "menu_item_category_id"
  //   );

  //   const categories = await Promise.all(
  //     Object.keys(menuItemByCategoryId).map(async (id) => {
  //       const category = await database
  //         .query(
  //           `select * from menu_item_category where menu_item_category_id = ${id}`
  //         )
  //         .then((res) => res.rows[0]);

  //       const menuItemProductRows = await database
  //         .query(
  //           `
  //         select * from menu_item_product where menu_item_menu_item_id in (${menuItemByCategoryId[
  //           id
  //         ]
  //           .map((item) => item.menu_item_id)
  //           .join(",")})
  //       `
  //         )
  //         .then((res) => res.rows);

  //       const menuItemProductRowsByMenuItemId = groupBy(
  //         menuItemProductRows,
  //         "menu_item_menu_item_id"
  //       );

  //       const productsIds = _.chain(menuItemProductRows)
  //         .map((row) => row.product_product_id)
  //         .uniq()
  //         .value();

  //       const productRows = await database
  //         .query(
  //           `
  //         select * from product where product_id in (${productsIds.join(",")})
  //       `
  //         )
  //         .then((res) => res.rows);

  //       const productRowsById = _.keyBy(productRows, "product_id");

  //       return new MenuCategory({
  //         id: category.menu_item_category_id,
  //         name: category.menu_item_category_name,
  //         menuItems: menuItemByCategoryId[id].map((menuItem) => {
  //           const menuItemProductRows =
  //             menuItemProductRowsByMenuItemId[menuItem.menu_item_id] || [];

  //           return new MenuItem({
  //             id: menuItem.menu_item_id,
  //             name: menuItem.item_name,
  //             price: menuItem.menu_item_price,
  //             configurable: menuItem.configurable,
  //             category: {
  //               id: category.menu_item_category_id,
  //               name: category.menu_item_category_name,
  //               menuItems: [],
  //             },
  //             products: menuItemProductRows.map((mipr) => {
  //               const product = productRowsById[mipr.product_product_id];
  //               return new Product({
  //                 id: mipr.product_product_id,
  //                 productName: product.product_name,
  //                 quantityInStock: product.quantity_in_stock,
  //                 conversionFactor: product.conversion_factor,
  //                 productTypeId: product.product_type_id,
  //               });
  //             }),
  //           });
  //         }),
  //       });
  //     })
  //   );

  //   res.status(200).json(new Menu({ categories }));
  // } catch (e) {
  //   console.log(e);
  //   res.status(500).end();
  // }
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
                id: 1,
                productName: "Cheese",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 1,
              },
              {
                id: 2,
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
                id: 1,
                productName: "Cheese",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 1,
              },
              {
                id: 2,
                productName: "Dough",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 2,
              },
              {
                id: 3,
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
            active: false,
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
                id: 4,
                productName: "Coke",
                quantityInStock: 100,
                conversionFactor: 1.0,
                productTypeId: 4,
              },
            ],
          },
          {
            active: false,
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
                id: 5,
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
