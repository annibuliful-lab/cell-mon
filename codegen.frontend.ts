import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3030/graphql',
  documents: 'libs/graphql-client/src/graphql/**/*.gql',
  generates: {
    'libs/graphql-client/src/graphql/generated/': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
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
