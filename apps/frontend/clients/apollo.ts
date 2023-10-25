import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { getCookie } from 'cookies-next';
import { createClient } from 'graphql-ws';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const getAuthContext = () => {
  const authorization = getCookie('token');
  const refreshToken = getCookie('refreshToken');

  return {
    authorization,
    refreshToken,
  };
};

const httpLink = setContext((_, { headers }) => {
  const { authorization } = getAuthContext();
  return {
    headers: {
      ...headers,
      ...(authorization && { authorization: `Bearer ${authorization}` }),
    },
  };
});

const wsLink = new GraphQLWsLink(
  createClient({
    lazy: true,
    url: 'ws://localhost:4000/subscriptions',
    connectionParams: () => {
      const { authorization } = getAuthContext();

      return {
        headers: authorization,
      };
    },
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink.concat(errorLink),
  cache: new InMemoryCache(),
});
