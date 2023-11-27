import { createWorkerClient } from '../../../libs/job/src';
import { TEST_QUEUE, sleep } from './constants';

export const workerA = createWorkerClient({
  name: TEST_QUEUE,
  processor: async (job) => {
    console.log('worker-a: ', job.data);
    await sleep(1000);
    return job;
  },
  options: {
    concurrency: 10,
  },
});
