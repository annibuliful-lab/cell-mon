import {
  GraphQLJSON,
  GraphQLJSONObject,
  GraphQLUpload,
  serialIdScalar,
} from '@cell-mon/graphql';
import { UUIDResolver } from 'graphql-scalars';

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
  field as missionTargetFieldResolver,
  mutation as missionTargetMutationResolver,
  query as missionTargetQueryResolver,
} from '../modules/mission-target/mission-target.resolver';
import {
  mutation as permissionAbilityMutationResolver,
  query as permissionAbilityQueryResolver,
} from '../modules/permission-ability/permission-ability.resolver';
import {
  mutation as phoneMetadataMutationResolver,
  query as phoneMetadataQueryResolver,
} from '../modules/phone-metadata/phone-metadata.resolver';
import {
  mutation as phoneTargetMutationResolver,
  query as phoneTargetQueryResolver,
} from '../modules/phone-target/phone-target.resolver';
import {
  field as targetFieldResolver,
  mutation as targetMutationResolver,
  query as targetQueryResolver,
} from '../modules/target/target.resolver';
import {
  mutation as targetEvidenceMutationResolver,
  query as targetEvidenceQueryResolver,
} from '../modules/target-evidence/target-evidence.resolver';
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
    ...targetQueryResolver,
    ...missionTargetQueryResolver,
    ...targetEvidenceQueryResolver,
    ...phoneTargetQueryResolver,
  },
  Mutation: {
    ...accountMutationResolver,
    ...permissionAbilityMutationResolver,
    ...authenticationResolver,
    ...workspaceMutationResolver,
    ...fileMutationResolver,
    ...phoneMetadataMutationResolver,
    ...missionMutationResolver,
    ...targetMutationResolver,
    ...missionTargetMutationResolver,
    ...targetEvidenceMutationResolver,
    ...phoneTargetMutationResolver,
  },
  Upload: GraphQLUpload,
  SerialId: serialIdScalar,
  JSON: GraphQLJSON,
  JSONObject: GraphQLJSONObject,
  UUID: UUIDResolver,
  ...missionTargetFieldResolver,
  ...targetFieldResolver,
};
