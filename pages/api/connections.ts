import { NextApiRequest, NextApiResponse } from "next";
import { createConnection } from "../../utils/db/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await createConnection(req.body);
  res.status(200).json({ id });
}
