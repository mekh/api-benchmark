import { Injectable } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigBase } from './_base.config';

@Injectable()
export class DbConfig extends ConfigBase implements PostgresConnectionOptions {
  public readonly type = 'postgres';

  public readonly autoLoadEntities = true;

  public readonly keepConnectionAlive = true;

  public readonly maxQueryExecutionTime =
    this.asNumber('DB_SLOW_QUERY_MS') ?? 100;

  public readonly database = this.asString('DB_NAME');

  public readonly host = this.asString('DB_HOST') ?? 'localhost';

  public readonly port = this.asNumber('DB_PORT');

  public readonly username = this.asString('DB_USER');

  public readonly password = this.asString('DB_PASS');

  public readonly logging = this.asBoolean('DB_LOGGING') ?? false;
}
