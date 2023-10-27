import {
  ApolloClient,
  FetchResult,
  HttpLink,
  InMemoryCache,
  ServerError,
  split,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import {
  RefreshTokenDocument,
  RefreshTokenMutation,
  RefreshTokenMutationVariables,
} from '@cell-mon/graphql-codegen';
import { createUploadLink } from 'apollo-upload-client';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { GraphQLError } from 'graphql';
import { createClient } from 'graphql-ws';

import {
  AUTH_COOKIE_KEY,
  AUTH_REFRESH_COOKIE_KEY,
  WORKSPACE_ID_COOKIE_KEY,
} from '../constants';

const errorLink = onError(({ networkError, operation, forward }) => {
  const networkErrors = networkError as ServerError;

  if (!(networkErrors?.statusCode === 401)) return;
  if (operation.operationName === 'refreshToken') return;

  const observable = new Observable<FetchResult<Record<string, unknown>>>(
    (observer) => {
      (async () => {
        try {
          const refreshToken = getCookie(AUTH_REFRESH_COOKIE_KEY);

          if (!refreshToken) {
            throw new GraphQLError('Invalid or expire token!');
          }

          const accessToken = await callRefreshToken();

          if (!accessToken) {
            throw new GraphQLError('Invalid or expire token!');
          }

          const subscriber = {
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          };

          forward(operation).subscribe(subscriber);
        } catch (err) {
          observer.error(err);
        }
      })();
    },
  );

  return observable;
});

const getAuthContext = () => {
  const authorization = getCookie(AUTH_COOKIE_KEY);
  const refreshToken = getCookie(AUTH_REFRESH_COOKIE_KEY);
  const workspaceId = getCookie(WORKSPACE_ID_COOKIE_KEY);

  return {
    ...(authorization && { authorization: `Bearer ${authorization}` }),
    ...(refreshToken && { refreshToken: `Bearer ${refreshToken}` }),
    ...(workspaceId && { workspaceId }),
  };
};

const httpLink = new HttpLink({
  uri: 'http://localhost:3030/graphql',
  headers: getAuthContext(),
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:3030/graphql',
    connectionParams: getAuthContext(),
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
  link: splitLink.concat(createUploadLink()).concat(errorLink),
  cache: new InMemoryCache(),
});

const callRefreshToken = async () => {
  const refreshToken = getCookie(AUTH_REFRESH_COOKIE_KEY);

  if (!refreshToken) return;

  try {
    const refreshTokenResponse = await apolloClient.mutate<
      RefreshTokenMutation,
      RefreshTokenMutationVariables
    >({
      mutation: RefreshTokenDocument,
      variables: {
        refreshToken: getCookie(AUTH_REFRESH_COOKIE_KEY),
      },
    });

    if (!refreshTokenResponse.data?.refreshToken) return;

    const accessToken = refreshTokenResponse.data.refreshToken.token;
    const refreshToken = refreshTokenResponse.data.refreshToken.refreshToken;

    setCookie(AUTH_COOKIE_KEY, accessToken);
    setCookie(AUTH_REFRESH_COOKIE_KEY, refreshToken);
    return accessToken;
  } catch (err) {
    deleteCookie(AUTH_COOKIE_KEY);
    deleteCookie(AUTH_REFRESH_COOKIE_KEY);
    deleteCookie(WORKSPACE_ID_COOKIE_KEY);

    console.error('call refresh token mutation', err);
    window.location.reload();
  }
};
