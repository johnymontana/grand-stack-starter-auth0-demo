import { typeDefs, resolvers } from "./graphql-schema";
import { ApolloServer } from "apollo-server";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

dotenv.config();

const augmentedSchema = makeAugmentedSchema({
  typeDefs,
  config: {
    auth: {
      hasRole: true,
      isAuthenticated: true,
      hasScope: false
    }
  }
});

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

const server = new ApolloServer({
  context: ({req}) => { 
    return {
      headers: req.headers,
      driver }},
  schema: augmentedSchema
});

server.listen(process.env.GRAPHQL_LISTEN_PORT, '0.0.0.0').then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`);
});