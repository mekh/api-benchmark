import UExpress from 'ultimate-express';

import { ExpressServer } from './express.server';

export class UltimateExpressServer extends ExpressServer {
  // @ts-ignore
  override app: UExpress.Express;

  constructor() {
    super();

    this.app = UExpress();
    this.app.use(UExpress.json())
  }
}
