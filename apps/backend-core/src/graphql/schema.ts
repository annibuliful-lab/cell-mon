import { accessDirective, permissionAbilityTypeDefs } from '@cell-mon/graphql';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { print } from 'graphql';
import {
  DateTimeTypeDefinition,
  JSONObjectDefinition,
  LatitudeDefinition,
  LongitudeDefinition,
  UUIDDefinition,
} from 'graphql-scalars';

import { hlrTypeDefs } from '../modules/hlr/hlr.schema';
import { jobTypeDefs } from '../modules/job/job.schema';

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
    jobTypeDefs,
    JSONObjectDefinition,
  ]),
);
