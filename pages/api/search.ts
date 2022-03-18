import { NextApiRequest, NextApiResponse } from "next";
import { searchConnections } from "../../utils/db/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query: any = req.query.q;
  const connections = await searchConnections(query);
  res.status(200).json({ connections });
}
