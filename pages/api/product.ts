import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../models/database";
import { IProduct } from "../../models/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != "POST") {
    res.status(405).end();
    return;
  }

  const body: IProduct = req.body;

  const id = await database
    .query(
      `insert into product (product_name, quantity_in_stock, conversion_factor, product_type_id) values ('${body.productName}', '${body.quantityInStock}', '${body.conversionFactor}', '${body.productTypeId}') returning product_id`
    )
    .then((result) => result.rows[0].product_id);

  res.status(200).json({ id });
}
