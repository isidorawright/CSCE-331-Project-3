import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  res.status(200).json({
    items: [
      {
        id: 1,
        name: "Pizza",
        active: true,
      },
      {
        id: 2,
        name: "Beverage",
      },
      {
        id: 3,
        name: "Other",
      },
    ],
  });
}
