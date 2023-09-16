import { mergeTypeDefs } from '@graphql-tools/merge';
import {
  accessDirective,
  authorizeDirective,
  authorizeMessageGroupDirective,
  deleteOperationResultTypeDef,
  serialIdTypeDef,
} from '@tadchud-erp/graphql';
import { print } from 'graphql';

import { accountTypeDefs } from '../modules/account/account.schema';
import { authenticationTypeDefs } from '../modules/authentication/authentication.schema';
import { featureFlagTypedefs } from '../modules/feature-flag/feature-flag.schema';
import { fileTypeDefs } from '../modules/file/file.schema';
import { messageTypedefs } from '../modules/message/message.schema';
import { permissionAbilityTypeDefs } from '../modules/permission-ability/permission-ability.schema';
import { productTypeDefs } from '../modules/product/product.schema';
import { projectTypeDefs } from '../modules/project/project.schema';
import { workspaceTypeDefs } from '../modules/workspace/workspace.schema';

const { accessdDirectiveTypeDefs } = accessDirective();
const { authorizedDirectiveTypeDefs } = authorizeDirective();
const { authorizeMessageGroupDirectiveTypeDefs } =
  authorizeMessageGroupDirective();

export const typeDefs = print(
  mergeTypeDefs([
    messageTypedefs,
    fileTypeDefs,
    workspaceTypeDefs,
    accountTypeDefs,
    productTypeDefs,
    featureFlagTypedefs,
    permissionAbilityTypeDefs,
    deleteOperationResultTypeDef,
    projectTypeDefs,
    authenticationTypeDefs,
    accessdDirectiveTypeDefs,
    authorizedDirectiveTypeDefs,
    authorizeMessageGroupDirectiveTypeDefs,
    serialIdTypeDef,
  ])
);
