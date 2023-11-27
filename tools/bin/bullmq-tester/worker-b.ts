import { createWorkerClient } from '../../../libs/job/src';
import { TEST_QUEUE, sleep } from './constants';

export const workerB = createWorkerClient({
  name: TEST_QUEUE,
  processor: async (job) => {
    console.log('worker-b: ', job.data);
    await sleep(2000);
    return job;
  },
  options: {
    concurrency: 10,
  },
});
