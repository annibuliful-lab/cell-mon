import { config } from 'dotenv';
import { main as primaryBackend } from '../../apps/backend/src/app';
config();

const runningServerService = async () => {
  await primaryBackend();
  const used = process.memoryUsage();
  for (const key in used) {
    console.log(
      `Memory: ${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`
    );
  }
  console.log('\n');
};

runningServerService();
