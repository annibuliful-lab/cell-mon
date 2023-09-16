import { GraphqlError } from './graphql-error';

export class AuthenticationError extends GraphqlError {
  constructor(message = 'Unauthorized', extensions?: object) {
    super(`Unauthorized: ${message}`, extensions, 401);
  }
}
