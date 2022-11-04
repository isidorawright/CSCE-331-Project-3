import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  res.status(200).json({
    items: [
      {
        id: 1,
        name: "Original Cheese",
        cost: 6.79,
      },
      {
        id: 2,
        name: "1 Topping",
        cost: 7.79,
      },
      {
        id: 3,
        name: "2-4 Topping",
        cost: 8.99,
      },
    ],
  });
}