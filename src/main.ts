import 'dotenv/config';
import * as process from 'node:process';

import { AppConfig } from './config/app.config';
import { PyroscopeConfig } from './config/pyroscope.config';
import { PyroscopeService } from './lib/pyroscope';
import { server } from './server';

const config = new AppConfig();
const pyroscopeConfig = new PyroscopeConfig();

const runPyroscope = () => {
  const pyroscope = new PyroscopeService({
    ...pyroscopeConfig.getConfig(),
    appName: config.appName,
    tags: {
      setup: `${config.server}-${config.httpLib}-${config.gqlDriver}`,
      server: config.server,
      httpLib: config.httpLib,
      gqlDriver: config.gqlDriver,
      testProto: config.testProto,
      joinMethod: config.joinMethod,
    },
  });

  pyroscope.start();
}

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

  if (pyroscopeConfig.enabled) {
    runPyroscope();
  }
};

run().catch((err: unknown) => {
  console.log('app is failed to start', err);

  process.exit(1);
});
