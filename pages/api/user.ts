import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // mock response
  res.status(200).json({
    username: "Casey Kaspol",
    role: "Customer",
  });
}
