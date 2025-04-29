import fastify from 'fastify';

import { BaseHttpServer } from './base.server';
import { FastifyInstance } from 'fastify/types/instance';

export class FastifyServer extends BaseHttpServer {
  private app: FastifyInstance;

  constructor() {
    super();

    this.app = fastify();
  }

  override async init() {
    await super.init();

    this.app.get('/info', (_) => {
      return this.info();
    });

    this.app.get('/health', (_) => {
      return this.health();
    });

    this.app.post('/graphql', (req) => {
      return this.executeGql((req.body as { query: string }).query)
    });

    this.app.get('/ormJoin', (_) => {
      return this.ormJoin()
    });

    this.app.get('/rawJoin', (_) => {
      return this.rawJoin()
    })
  }

  async listen(host: string, port: number, cb?: () => any): Promise<void> {
    await this.app.listen({ port, host });

    if (cb) cb();
  }
}
