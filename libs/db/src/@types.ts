export const prismaClientOption = {
  log: [
    { emit: 'event', level: 'query' } as const,
    { emit: 'event', level: 'info' } as const,
    { emit: 'event', level: 'warn' } as const,
    { emit: 'event', level: 'error' } as const,
  ],
};
