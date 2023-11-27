import { createQueueClient } from '../../../libs/job/src';
import { TEST_QUEUE } from './constants';

export async function main() {
  const queue = createQueueClient({ name: TEST_QUEUE });
  let i = 0;

  setInterval(async () => {
    await queue.add('test', {
      data: `AAAAA_${i}`,
    });
    i++;
  }, 100);
}
