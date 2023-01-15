import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Auth } from "aws-amplify";
import React from "react";

const httpLink = createHttpLink({
  uri: process.env["REACT_APP_API_URL"],
});

const authLink = setContext(async (_, { headers }) => {
  const session = await Auth.currentSession();
  const token = session.getIdToken().getJwtToken();
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export type ApolloClientProviderProps = {
  children: React.ReactNode;
};

export const ApolloClientProvider: React.FC<ApolloClientProviderProps> = (
  props
) => {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};
