import { ApolloServer, gql } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { programs } from "@/app/data/database";

const typeDefs = gql`
  type Program {
    id: Int
    name: String
    context: [String]
  }

  type Query {
    programs: [Program]
  }
`;

const resolvers = {
  Query: {
    programs: () => programs,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

// Create the handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await startServer;
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
}

// Disable body parsing for GraphQL
export const config = {
  api: {
    bodyParser: false,
  },
};
