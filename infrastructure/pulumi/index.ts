import * as vultr from '@ediri/vultr';
import {
  OBJECT_STORAGE_CLUSTER_ID,
  LABEL,
  TAG,
  REGION,
  TIME_ZONE,
} from './constants';
export const objectStorage = new vultr.ObjectStorage('cell-mon', {
  clusterId: OBJECT_STORAGE_CLUSTER_ID,
  label: LABEL,
});

export const pgDatabase = new vultr.Database('cell-mon-pg-dev', {
  clusterTimeZone: TIME_ZONE,
  databaseEngine: 'pg',
  databaseEngineVersion: '15',
  label: 'cell-mon',
  plan: 'vultr-dbaas-hobbyist-cc-1-25-1',
  region: REGION,
  tag: TAG,
  password: 'cell-mon',
});

export const redisDatabase = new vultr.Database('cell-mon-redis-dev', {
  clusterTimeZone: TIME_ZONE,
  databaseEngine: 'redis',
  databaseEngineVersion: '7',
  label: 'cell-mon',
  plan: 'vultr-dbaas-hobbyist-cc-hp-amd-1-11-1',
  region: REGION,
  tag: TAG,
  password: 'cell-mon',
});
