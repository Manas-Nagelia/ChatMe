import { NextApiRequest, NextApiResponse } from "next";
import { createIndex } from "../../utils/db/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await createIndex();
  res.status(200).send("200 OK");
}
