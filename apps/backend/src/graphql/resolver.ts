import { serialIdScalar } from '@tadchud-erp/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import { Resolvers } from '../codegen-generated';
import {
  mutationResolver as accountMutationResolver,
  queryResolver as accountQueryResolver,
} from '../modules/account/account.resolver';
import { mutationResolver as authenticationResolver } from '../modules/authentication/authentication.resolver';
import {
  mutationResolver as featureFlagMutationResolver,
  queryResolver as featureFlagQueryResolver,
} from '../modules/feature-flag/feature-flag.resolver';
import { mutationResolver as fileMutationResolver } from '../modules/file/file.resolver';
import {
  mutationResolver as messageGroupMutationResolver,
  queryResolver as messageGroupQueryResolver,
} from '../modules/message/message.resolver';
import {
  mutationResolver as permissionAbilityMutationResolver,
  queryResolver as permissionAbilityQueryResolver,
} from '../modules/permission-ability/permission-ability.resolver';
import {
  mutationResolver as projectMutationResolver,
  queryResolver as projectQueryResolver,
} from '../modules/project/project.resolver';
import {
  mutationResolver as workspaceMutationResolver,
  queryResolver as workspaceQueryResolver,
} from '../modules/workspace/workspace.resolver';

export const resolvers: Resolvers = {
  Query: {
    ...projectQueryResolver,
    ...permissionAbilityQueryResolver,
    ...featureFlagQueryResolver,
    ...workspaceQueryResolver,
    ...messageGroupQueryResolver,
    ...accountQueryResolver,
  },
  Mutation: {
    ...messageGroupMutationResolver,
    ...projectMutationResolver,
    ...accountMutationResolver,
    ...permissionAbilityMutationResolver,
    ...authenticationResolver,
    ...featureFlagMutationResolver,
    ...workspaceMutationResolver,
    ...fileMutationResolver,
  },
  Upload: GraphQLUpload,
  SerialId: serialIdScalar,
};
