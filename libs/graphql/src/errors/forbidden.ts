import { GraphqlError } from './graphql-error';

export class ForbiddenError extends GraphqlError {
  constructor(message = '', extensions?: object) {
    super(`Forbidden: ${message}`, extensions, 403);
  }
}
