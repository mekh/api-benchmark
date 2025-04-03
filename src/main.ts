import 'dotenv/config';
import * as process from 'node:process';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppConfig } from './config/app.config';
import { AppModule } from './app.module';

import { createExpressServer, createFastifyServer } from './raw/server';

const config = new AppConfig();

const createNestApp = async () => {
  const appModule = AppModule.forRoot(config.gqlDriver);

  return config.httpLib === 'express'
    ? await NestFactory.create<NestExpressApplication>(appModule)
    : await NestFactory.create<NestFastifyApplication>(
        appModule,
        new FastifyAdapter(),
      );
};

const run = async (): Promise<void> => {
  let app: { listen: (port: number, cb?: () => any) => any };

  switch (config.server) {
    case 'nest':
      app = await createNestApp();
      break;
    case 'raw':
      app =
        config.httpLib === 'express'
          ? createExpressServer()
          : createFastifyServer();
      break;
    default:
      throw new Error('invalid config');
  }

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
