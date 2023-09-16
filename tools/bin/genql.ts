import { generate } from '@genql/cli';
import { config } from 'dotenv';
import * as path from 'path';
import { typeDefs } from '../../apps/backend/src/graphql/schema';
config();

generate({
  schema: typeDefs,
  // endpoint: process.env.GRAPHQL_ENDPOINT,
  output: path.join(__dirname, '../../libs/test/src/graphql/generated'),
})
  .then(() => {
    console.log('Generated');
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
  });
