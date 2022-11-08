import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  res.status(200).json({
    items: [
      {
        id: 1,
        name: "Pepperoni",
      },
      {
        id: 2,
        name: "Cabbage",
      },
      {
        id: 3,
        name: "Pumpkin",
      },
    ],
  });
}
