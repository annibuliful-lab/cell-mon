import { GraphQLUpload, serialIdScalar } from '@cell-mon/graphql';

import { Resolvers } from '../codegen-generated';
import {
  mutationResolver as accountMutationResolver,
  queryResolver as accountQueryResolver,
} from '../modules/account/account.resolver';
import { mutationResolver as authenticationResolver } from '../modules/authentication/authentication.resolver';
import { mutationResolver as fileMutationResolver } from '../modules/file/file.resolver';
import {
  mutationResolver as permissionAbilityMutationResolver,
  queryResolver as permissionAbilityQueryResolver,
} from '../modules/permission-ability/permission-ability.resolver';
import {
  mutationResolver as workspaceMutationResolver,
  queryResolver as workspaceQueryResolver,
} from '../modules/workspace/workspace.resolver';

export const resolvers: Resolvers = {
  Query: {
    ...permissionAbilityQueryResolver,
    ...workspaceQueryResolver,
    ...accountQueryResolver,
  },
  Mutation: {
    ...accountMutationResolver,
    ...permissionAbilityMutationResolver,
    ...authenticationResolver,
    ...workspaceMutationResolver,
    ...fileMutationResolver,
  },
  Upload: GraphQLUpload,
  SerialId: serialIdScalar,
};
