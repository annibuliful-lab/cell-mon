import { GraphqlError } from './graphql-error';

export class InternalGraphqlError extends GraphqlError {
  constructor() {
    super(
      `Internal server error`,
      {
        statusCode: 500,
      },
      500,
    );
  }
}
