import { Injectable } from '@nestjs/common';

import { ConfigBase } from './.base.config';

type Server = 'raw' | 'nest';
type Lib = 'express' | 'fastify';
type Driver = 'apollo' | 'mercurius' | 'raw';

@Injectable()
export class AppConfig extends ConfigBase {
  public readonly server: Server;

  public readonly httpLib: Lib;

  public readonly gqlDriver: Driver;

  constructor() {
    super();

    const env = this.asString('APP_PLATFORM');
    if (!env) {
      throw new Error('APP_PLATFORM is not defined');
    }

    const [server, lib] = env.split('-').map((i) => i.trim());
    if (!server || !lib) {
      throw new Error('APP_PLATFORM is invalid');
    }

    this.server = server as Server;
    this.httpLib = lib as Lib;

    if (this.server === 'nest') {
      this.gqlDriver = this.httpLib === 'express' ? 'apollo' : 'mercurius';
    } else {
      this.gqlDriver = 'raw';
    }
  }

  public readonly host = this.asString('APP_HOST') ?? 'localhost';

  public readonly port = this.asNumber('APP_PORT') ?? 3000;
}
