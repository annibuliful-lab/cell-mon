import { GraphqlError } from './graphql-error';

export class BadRequest extends GraphqlError {
  constructor(fields: string[], extensions?: object) {
    super(`Bad request resources: ${fields}`, extensions, 400);
  }
}
