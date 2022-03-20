import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

const connect = async () => {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
    console.log("Connected to Redis");
  } else {
    console.log("Already connected to Redis");
  }
};

const disconnect = async () => {
  if (client.isOpen()) await client.close();
};

class Connections extends Entity {}
let schema = new Schema(
  Connections,
  {
    connection_from: { type: "string" },
    to_email: { type: "string" },
    connection_to: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

export const createConnection = async (data: any) => {
  await connect();

  const repository = client.fetchRepository(schema);
  const connection = repository.createEntity(data);

  const id = await repository.save(connection);
  let ttlInSeconds = 24 * 60 * 60; // 24 hours
  await repository.expire(id, ttlInSeconds);
  return id;
};

export const createIndex = async () => {
  await connect();

  const repository = client.fetchRepository(schema);
  await repository.createIndex();
};

export const searchConnections = async (query: string) => {
  await connect();

  const repository = client.fetchRepository(schema);
  const connections = await repository
    .search()
    .where("connection_from")
    .eq(query)
    .return.all();

  return connections;
};
