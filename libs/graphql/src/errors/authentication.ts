import { GraphqlError } from './graphql-error';

export class AuthenticationError extends GraphqlError {
  constructor(message = 'Unauthorized') {
    super(`Unauthorized: ${message}`, {
      statusCode: 401,
    });
  }
}
