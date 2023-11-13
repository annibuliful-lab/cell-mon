import * as vultr from '@ediri/vultr';
import { REGION } from './constants';

export const vpc = new vultr.Vpc2('cell-mon-dev', {
  description: 'cell-mon dev vpc',
  region: REGION,
});
