import * as vultr from '@ediri/vultr';
import {
  K8S_NODE_QUANTITY,
  K8S_VERSION,
  PRIMARY_K8S_NODE_POOL_PLAN,
  REGION,
} from './constants';

export const k8 = new vultr.Kubernetes('cell-mon-dev', {
  label: 'cell-mon-dev',
  nodePools: {
    autoScaler: false,
    label: 'cell-mon-dev-nodepool',
    nodeQuantity: K8S_NODE_QUANTITY,
    plan: PRIMARY_K8S_NODE_POOL_PLAN,
  },
  region: REGION,
  version: K8S_VERSION,
});
