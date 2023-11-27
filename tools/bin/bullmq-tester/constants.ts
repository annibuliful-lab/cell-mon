export const TEST_QUEUE = 'TEST_QUEUE';
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
