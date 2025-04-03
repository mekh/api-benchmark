import 'dotenv/config';
import * as process from 'node:process';

import { AppConfig } from './config/app.config';
import { server } from './server';

const config = new AppConfig();

const run = async (): Promise<void> => {
  const getServer = config.server === 'nest'
    ? server.nest
    : server[config.httpLib];

  if (!getServer) {
    throw new Error('invalid config')
  }

  const app = getServer();
  await app.init();

  await app.listen(config.port, () => {
    console.log(
      `${config.server}-${config.httpLib}/${config.gqlDriver} is running on ${config.host}:${config.port}`,
    );
  });
};

run().catch((err: unknown) => {
  console.log('app is failed to start', err);

  process.exit(1);
});
