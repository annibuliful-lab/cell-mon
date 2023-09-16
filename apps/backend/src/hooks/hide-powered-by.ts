import { FastifyInstance } from 'fastify';

type OptionType = {
  setTo?: string;
};

export const hidePoweredBy = (
  app: FastifyInstance,
  opts: OptionType,
  next: () => void
) => {
  const HEADER = 'X-Powered-By';
  const value = opts.setTo;

  app.addHook('onSend', (_request, reply, _payload, next) => {
    value ? reply.header(HEADER, value) : reply.removeHeader(HEADER);
    next();
  });

  next();
};
