import { redisClient } from '@cell-mon/db';
import {
  Processor,
  Queue,
  QueueEvents,
  QueueEventsOptions,
  QueueOptions,
  Worker,
  WorkerOptions,
} from 'bullmq';
import { config } from 'dotenv';
import { Redis } from 'ioredis';
config();

type CreateQueueClientParam = {
  name: string;
  options?: QueueOptions;
  connection?: Redis;
};

export const createQueueClient = <Type, Result = unknown>({
  name,
  options,
  connection = redisClient,
}: CreateQueueClientParam) => {
  return new Queue<Type, Result>(name, {
    ...options,
    connection,
  });
};

type CreateQueueEventClientParam = {
  name: string;
  options?: QueueEventsOptions;
  connection: Redis;
};

export const createQueueEventClient = ({
  name,
  options,
  connection = redisClient,
}: CreateQueueEventClientParam) => {
  return new QueueEvents(name, {
    ...options,
    connection,
  });
};

type CreateQueueWorkerClient<Type, Result> = {
  name: string;
  processor: Processor<Type, Result, string>;
  options?: WorkerOptions;
  connection?: Redis;
};

export const createWorkerClient = <Type, Result>({
  name,
  processor,
  options = {},
  connection = redisClient,
}: CreateQueueWorkerClient<Type, Result>) => {
  return new Worker<Type, Result>(name, processor, {
    ...options,
    connection,
  });
};
