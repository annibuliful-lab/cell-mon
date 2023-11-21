import { GraphqlError } from './graphql-error';

export class BadRequest extends GraphqlError {
  constructor(fields: string[], message = 'Bad request resources') {
    super(`${message}: ${fields}`, {
      statusCode: 400,
    });
  }
}
