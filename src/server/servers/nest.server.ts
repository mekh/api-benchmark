import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../../app.module';
import { AppConfig } from '../../config/app.config';
import { BaseHttpServer } from './base.server';

export class NestServer extends BaseHttpServer {
  private readonly config = new AppConfig();

  private app!: NestExpressApplication | NestFastifyApplication;

  public override async init() {
    const appModule = AppModule.forRoot(this.config.gqlDriver);

    this.app = this.config.httpLib === 'express'
      ? await NestFactory.create<NestExpressApplication>(appModule)
      : await NestFactory.create<NestFastifyApplication>(
        appModule,
        new FastifyAdapter(),
      );
  }

  public async listen(port: number, cb?: () => any) {
    await this.app.listen(port, cb);
  }
}
