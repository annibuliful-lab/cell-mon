import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3030/graphql',
  documents: 'libs/graphql-codegen/src/**/*.gql',
  generates: {
    'libs/graphql-codegen/src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
        {
          typescript: {
            enumsAsTypes: false,
            skipTypename: true,
            maybeValue: 'T | undefined',
            scalars: {
              Upload: 'Promise<GraphQLFileUpload>',
              DateTime: 'Date',
              SerialId: 'number',
              UUID: 'string',
              Latitude: 'number',
              Longitude: 'number',
            },
          },
        },
      ],
      config: {
        withHooks: true,
        withRefetchFn: true,
        withMutationFn: true,
      },
    },
  },
};

export default config;
