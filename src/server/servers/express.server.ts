import express, { Express } from 'express';

import { BaseHttpServer } from './base.server';

export class ExpressServer extends BaseHttpServer {
  private app: Express;

  constructor() {
    super();

    this.app = express();
    this.app.use(express.json())
  }

  override async init() {
    await super.init();

    this.app.get('/info', (_, res) => {
      res.json(this.info());
    });

    this.app.get('/health', (_, res) => {
      res.end(this.health());
    });

    this.app.post('/graphql', (req, res) => {
      this
        .executeGql((req.body as { query: string }).query)
        .then(res.json.bind(res))
    });

    this.app.get('/ormJoin', (_, res) => {
      this
        .ormJoin()
        .then(res.json.bind(res))
    });

    this.app.get('/rawJoin', (_, res) => {
      this
        .rawJoin()
        .then(res.json.bind(res))
    })
  }

  async listen(host: string, port: number, cb?: () => any): Promise<void> {
    this.app.listen(port, host, cb)
  }
}
