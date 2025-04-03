import { BaseHttpServer } from './servers/base.server';
import { ExpressServer } from './servers/express.server';
import { FastifyServer } from './servers/fastiry.server';
import { NestServer } from './servers/nest.server';
import { UltimateExpressServer } from './servers/ultimate-express.server';

export const server: Record<string, (() => BaseHttpServer) | undefined> = {
  express: () => new ExpressServer(),
  fastify: () => new FastifyServer(),
  uexpress: () => new UltimateExpressServer(),
  nest: () => new NestServer(),
};
