import { GraphqlError } from './graphql-error';

export class DuplicatedResource extends GraphqlError {
  constructor(fields: string[]) {
    super(`Duplicated resources: ${fields}`, {
      statusCode: 409,
    });
  }
}
