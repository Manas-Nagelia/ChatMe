import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

const connect = async () => {
  if (!client.isOpen()) await client.open(process.env.REDIS_URL);
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
    .where("connection_to")
    .eq(query)
    .return.all();

  return connections;
};
