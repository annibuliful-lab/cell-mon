import { GraphQLUpload, serialIdScalar } from '@cell-mon/graphql';

import { Resolvers } from '../codegen-generated';
import {
  mutation as accountMutationResolver,
  query as accountQueryResolver,
} from '../modules/account/account.resolver';
import { mutation as authenticationResolver } from '../modules/authentication/authentication.resolver';
import { mutation as fileMutationResolver } from '../modules/file/file.resolver';
import {
  mutation as missionMutationResolver,
  query as missionQueryResolver,
} from '../modules/mission/mission.resolver';
import {
  mutation as permissionAbilityMutationResolver,
  query as permissionAbilityQueryResolver,
} from '../modules/permission-ability/permission-ability.resolver';
import {
  mutation as phoneMetadataMutationResolver,
  query as phoneMetadataQueryResolver,
} from '../modules/phone-metadata/phone-metadata.resolver';
import {
  mutation as workspaceMutationResolver,
  query as workspaceQueryResolver,
} from '../modules/workspace/workspace.resolver';

export const resolvers: Resolvers = {
  Query: {
    ...permissionAbilityQueryResolver,
    ...workspaceQueryResolver,
    ...accountQueryResolver,
    ...phoneMetadataQueryResolver,
    ...missionQueryResolver,
  },
  Mutation: {
    ...accountMutationResolver,
    ...permissionAbilityMutationResolver,
    ...authenticationResolver,
    ...workspaceMutationResolver,
    ...fileMutationResolver,
    ...phoneMetadataMutationResolver,
    ...missionMutationResolver,
  },
  Upload: GraphQLUpload,
  SerialId: serialIdScalar,
};
