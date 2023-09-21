import { GraphqlError } from './graphql-error';

export class NotfoundResource extends GraphqlError {
  constructor(fields: string[], model = '', extensions?: object) {
    super(`Not found resources ${model}: ${fields}`, extensions, 404);
  }
}
