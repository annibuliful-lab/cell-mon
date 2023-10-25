import { mqRedisEmitter } from '@cell-mon/db';
import { MercuriusCommonOptions } from 'mercurius';

export const subscriptionResolver: MercuriusCommonOptions['subscription'] = {
  emitter: mqRedisEmitter,
  verifyClient(info, next) {
    console.log('info', info);
    next(true);
  },
};
