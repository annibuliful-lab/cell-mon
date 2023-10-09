import {
  accessDirective,
  deleteOperationResultTypeDef,
  jsonTypeDef,
  paginationTypeDef,
  priorityTypeDef,
  serialIdTypeDef,
} from '@cell-mon/graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import {
  DateTimeTypeDefinition,
  LatitudeDefinition,
  LongitudeDefinition,
  UUIDDefinition,
} from 'graphql-scalars';

import { accountTypeDefs } from '../modules/account/account.schema';
import { authenticationTypeDefs } from '../modules/authentication/authentication.schema';
import { fileTypeDefs } from '../modules/file/file.schema';
import { missionTypedef } from '../modules/mission/mission.schema';
import { missionTargetTypeDef } from '../modules/mission-target/mission-target.schema';
import { permissionAbilityTypeDefs } from '../modules/permission-ability/permission-ability.schema';
import { phoneTypeDefs } from '../modules/phone-metadata/phone-metadata.schema';
import { phoneTargetTypeDef } from '../modules/phone-target/phone-target.schema';
import { phoneTargetLocationTypeDef } from '../modules/phone-target-location/phone-target-location.schema';
import { targetTypeDef } from '../modules/target/target.schema';
import { targetEvidenceTypeDef } from '../modules/target-evidence/target-evidence.schema';
import { workspaceTypeDefs } from '../modules/workspace/workspace.schema';

const { accessdDirectiveTypeDefs } = accessDirective();

export const typeDefs = print(
  mergeTypeDefs([
    DateTimeTypeDefinition,
    UUIDDefinition,
    fileTypeDefs,
    workspaceTypeDefs,
    accountTypeDefs,
    permissionAbilityTypeDefs,
    deleteOperationResultTypeDef,
    authenticationTypeDefs,
    accessdDirectiveTypeDefs,
    serialIdTypeDef,
    phoneTypeDefs,
    missionTypedef,
    paginationTypeDef,
    jsonTypeDef,
    targetTypeDef,
    priorityTypeDef,
    missionTargetTypeDef,
    targetEvidenceTypeDef,
    phoneTargetTypeDef,
    phoneTargetLocationTypeDef,
    LatitudeDefinition,
    LongitudeDefinition,
  ]),
);
