import { accessDirective, permissionAbilityTypeDefs } from '@cell-mon/graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import {
  DateTimeTypeDefinition,
  LatitudeDefinition,
  LongitudeDefinition,
  UUIDDefinition,
} from 'graphql-scalars';

import { hlrTypeDefs } from '../modules/hlr/hlr.schema';

const { accessdDirectiveTypeDefs } = accessDirective();

export const typeDefs = print(
  mergeTypeDefs([
    hlrTypeDefs,
    DateTimeTypeDefinition,
    LatitudeDefinition,
    LongitudeDefinition,
    UUIDDefinition,
    accessdDirectiveTypeDefs,
    permissionAbilityTypeDefs,
  ]),
);
