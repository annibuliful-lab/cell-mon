import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
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
    authorization: `Bearer ${authorization}`,
    refreshToken: `Bearer ${refreshToken}`,
  };
};

const httpLink = new HttpLink({
  uri: 'http://localhost:3030/graphql',
  headers: getAuthContext(),
});

const wsLink = new GraphQLWsLink(
  createClient({
    lazy: true,
    shouldRetry: () => true,
    url: 'ws://localhost:3030/graphql',
    connectionParams: () => {
      const { authorization } = getAuthContext();

      return {
        authorization: authorization ?? 'test-auth',
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
