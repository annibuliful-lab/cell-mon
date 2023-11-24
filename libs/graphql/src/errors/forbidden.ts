import { GraphqlError } from './graphql-error';

export class ForbiddenError extends GraphqlError {
  constructor(message = '') {
    super(
      `Forbidden: ${message}`,
      {
        statusCode: 403,
      },
      403,
    );
  }
}
