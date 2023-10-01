import {
  accessDirective,
  deleteOperationResultTypeDef,
  paginationTypeDef,
  serialIdTypeDef,
} from '@cell-mon/graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';

import { accountTypeDefs } from '../modules/account/account.schema';
import { authenticationTypeDefs } from '../modules/authentication/authentication.schema';
import { fileTypeDefs } from '../modules/file/file.schema';
import { missionTypedef } from '../modules/mission/mission.schema';
import { permissionAbilityTypeDefs } from '../modules/permission-ability/permission-ability.schema';
import { phoneTypeDefs } from '../modules/phone-metadata/phone-metadata.schema';
import { workspaceTypeDefs } from '../modules/workspace/workspace.schema';

const { accessdDirectiveTypeDefs } = accessDirective();

export const typeDefs = print(
  mergeTypeDefs([
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
  ])
);
