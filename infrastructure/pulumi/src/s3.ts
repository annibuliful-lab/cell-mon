import * as vultr from '@ediri/vultr';
import { OBJECT_STORAGE_CLUSTER_ID, LABEL } from './constants';

export const objectStorage = new vultr.ObjectStorage('cell-mon', {
  clusterId: OBJECT_STORAGE_CLUSTER_ID,
  label: LABEL,
});
