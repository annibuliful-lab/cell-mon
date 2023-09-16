import { GraphqlError } from './graphql-error';

export class DuplicatedResource extends GraphqlError {
  constructor(fields: string[], extensions?: object) {
    super(`Duplicated resources: ${fields}`, extensions, 409);
  }
}
