import {
  accessDirective,
  authorizeDirective,
  authorizeMessageGroupDirective,
  deleteOperationResultTypeDef,
  serialIdTypeDef,
} from '@cell-mon/graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';

import { accountTypeDefs } from '../modules/account/account.schema';
import { authenticationTypeDefs } from '../modules/authentication/authentication.schema';
import { fileTypeDefs } from '../modules/file/file.schema';
import { permissionAbilityTypeDefs } from '../modules/permission-ability/permission-ability.schema';
import { workspaceTypeDefs } from '../modules/workspace/workspace.schema';

const { accessdDirectiveTypeDefs } = accessDirective();
const { authorizedDirectiveTypeDefs } = authorizeDirective();
const { authorizeMessageGroupDirectiveTypeDefs } =
  authorizeMessageGroupDirective();

export const typeDefs = print(
  mergeTypeDefs([
    fileTypeDefs,
    workspaceTypeDefs,
    accountTypeDefs,
    permissionAbilityTypeDefs,
    deleteOperationResultTypeDef,
    authenticationTypeDefs,
    accessdDirectiveTypeDefs,
    authorizedDirectiveTypeDefs,
    authorizeMessageGroupDirectiveTypeDefs,
    serialIdTypeDef,
  ])
);
