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

  async listen(port: number, cb?: () => any): Promise<void> {
    this.app.listen(port, cb)
  }
}
