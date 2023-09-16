import { GraphqlError } from './graphql-error';

export class NotfoundResource extends GraphqlError {
  constructor(fields: string[], extensions?: object) {
    super(`Not found resources: ${fields}`, extensions, 404);
  }
}
