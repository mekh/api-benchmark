import { Injectable } from '@nestjs/common';

import { ConfigBase } from './_base.config';

type Server = 'raw' | 'nest';
type HttpLib = 'express' | 'fastify' | 'uexpress';
export type GqlDriver = 'apollo' | 'mercurius' | 'raw' | 'none';

@Injectable()
export class AppConfig extends ConfigBase {
  public readonly server: Server;

  public readonly httpLib: HttpLib;

  public readonly gqlDriver: GqlDriver;

  public readonly joinMethod = this.asEnum('JOIN_METHOD', ['ormJoin', 'rawJoin'], true);

  public readonly testProto = this.asEnum('TEST_PROTO', ['gql', 'http'], true);

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
    this.httpLib = lib as HttpLib;
    this.gqlDriver = 'none';

    if (this.testProto === 'gql') {
      this.gqlDriver = this.server === 'nest'
        ? this.httpLib === 'express' ? 'apollo' : 'mercurius'
        : 'raw';
    }
  }

  public readonly host = this.asString('APP_HOST') ?? 'localhost';

  public readonly port = this.asNumber('APP_PORT') ?? 3000;

  public readonly appName = this.asString('APP_NAME') ?? 'api-benchmark';
}
