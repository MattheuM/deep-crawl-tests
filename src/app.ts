import "reflect-metadata";
import { buildSchema } from "type-graphql";
import * as express from "express";
import { createServer } from "http";
import { CrawlerResolver } from "./resolver";
import { ApolloServer } from "apollo-server-express";
import { pubsub } from "./publisher";

const getSchema = async () => buildSchema({
  resolvers: [CrawlerResolver],
  pubSub: pubsub,
});

const getServer = async () => new ApolloServer({
  schema: await getSchema(),
  playground: true,
});


async function bootstrap(): Promise<void> {
  const app = express();
  const server = await getServer();

  server.applyMiddleware({ app, path: '/' });

  const httpServer = createServer(app);

  server.installSubscriptionHandlers(httpServer);
  httpServer.listen({ port: 4000 }, () => {
    // tslint:disable-next-line:no-console
    console.log("Apollo Server on http://localhost:4000/");
  });
}

(async () => bootstrap())();
