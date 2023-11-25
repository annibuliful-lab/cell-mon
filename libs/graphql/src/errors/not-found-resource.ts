import { GraphqlError } from './graphql-error';

export class NotfoundResource extends GraphqlError {
  constructor(fields: string[], model = '') {
    super(
      `Not found resources ${model}: ${fields}`,
      {
        statusCode: 404,
      },
      404,
    );
  }
}
