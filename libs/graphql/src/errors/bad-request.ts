import { GraphqlError } from './graphql-error';

export class BadRequest extends GraphqlError {
  constructor(fields: string[]) {
    super(`Bad request resources: ${fields}`, {
      statusCode: 400,
    });
  }
}
