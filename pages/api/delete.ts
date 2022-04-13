import { NextApiRequest, NextApiResponse } from "next";
import { deleteConnection } from "../../utils/db/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query: any = req.query.query;
  const connections = await deleteConnection(query);
  res.status(200).json({ connections });
}
