import { deepEqual } from "assert";
import { group } from "console";
import _, { groupBy, uniq } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { Menu, MenuCategory } from "../../models/menu";
import { MenuItem } from "../../models/menuItem";
import { Product } from "../../models/product";
//import groupby from 'nestedGroupByCode';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


const all_menu_rows =  await database.query(`select * from menu_item_category full outer JOIN menu_item ON 
menu_item.menu_item_category_id = menu_item_category.menu_item_category_id 
full outer JOIN menu_item_product ON menu_item_product.menu_item_menu_item_id = menu_item.menu_item_id 
full outer join product ON product.product_id = menu_item_product.product_product_id 
ORDER BY menu_item_category.menu_item_category_name`).then((res) => res.rows)


  const result = _.chain(all_menu_rows)
    .filter(row => row.menu_item_category_name)
    .groupBy("menu_item_category_name")
    .map((rows, categoryName, collection) => {
      return new MenuCategory({
        id: rows[0]?.category_id,
        name: categoryName,
        active: false,
        menuItems: _.chain(rows)
        .filter(menuItem => menuItem.item_name)
        .groupBy("item_name")
        .map((rows, menuItemName) => {
          let firstRow = rows[0];
          return {
            id: firstRow.menu_item_id,
            name: menuItemName,
            price: firstRow.menu_item_price,
            configurable: firstRow.configurable,
            category: {
              id: firstRow.menu_item_category_id,
              name: firstRow.menu_item_category_name,
              active: false,
              menuItems: [],
            },
            products: rows.length ? rows.map(row => ({
              id: row.product_id,
              productName: row.product_name,
              quantityInStock: row.quantity_in_stock,
              conversionFactor: row.conversion_factor,
              productTypeId: row.product_type_id,
            })) : []

          }
        })
        .value()
      });
    }).value();


    res.status(200).json(result); 



}
