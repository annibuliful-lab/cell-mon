import { generate } from '@genql/cli';
import { config } from 'dotenv';
import * as path from 'path';
import { typeDefs } from '../../apps/backend/src/graphql/schema';
config();

async function main() {
  await generate({
    schema: typeDefs,
    output: path.join(__dirname, '../../libs/test/src/graphql/generated'),
  });

  await generate({
    schema: typeDefs,
    output: path.join(
      __dirname,
      '../../libs/graphql-client/src/generated/primary'
    ),
  });
  process.exit(0);
}

main();
