import * as vultr from '@ediri/vultr';
import { TAG, REGION, TIME_ZONE } from './constants';
import { vpc } from './vpc';

export const pgDatabase = new vultr.Database('cell-mon-pg-dev', {
  vpcId: vpc.id,
  clusterTimeZone: TIME_ZONE,
  databaseEngine: 'pg',
  databaseEngineVersion: '15',
  label: 'cell-mon',
  plan: 'vultr-dbaas-hobbyist-cc-hp-amd-1-11-1',
  region: REGION,
  tag: TAG,
  password: 'cell-mon',
});

export const redisDatabase = new vultr.Database('cell-mon-redis-dev', {
  vpcId: vpc.id,
  clusterTimeZone: TIME_ZONE,
  databaseEngine: 'redis',
  databaseEngineVersion: '7',
  label: 'cell-mon',
  plan: 'vultr-dbaas-hobbyist-cc-hp-amd-1-11-1',
  region: REGION,
  tag: TAG,
  password: 'cell-mon',
});
