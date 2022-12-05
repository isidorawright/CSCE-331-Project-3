import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { IProduct } from "../../models/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST"){
    const body: IProduct = req.body;

    const id = await database
      .query(
        `insert into product (product_name, quantity_in_stock, conversion_factor, product_type_id) values ('${body.productName}', '${body.quantityInStock}', '${body.conversionFactor}', '${body.productTypeId}') returning product_id`
      )
      .then((result) => result.rows[0].product_id);

    res.status(200).json({ id });
    return;
  }

  else if (req.method == "GET" || req.method == "FETCH"){
    const response = await database.query(
        `SELECT product.product_id, product.product_name, product_type.product_type_name, product.quantity_in_stock, product.conversion_factor
        FROM product 
        JOIN product_type 
        ON product.product_type_id=product_type.product_type_id
        ORDER BY product.product_id ASC`
      )
      
      res.status(200).send(response.rows);
      return;
  }

  else if (req.method == "PUT") {
    const response = await database.query(
      `update product set quantity_in_stock = ${req.query.quantity} where product_name = '${req.query.productName}'`
    )
    res.status(200).send(response.rows);
  }

  else {
    res.status(405).end();
    return;
  }
  
}
