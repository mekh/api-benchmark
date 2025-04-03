import { Injectable } from '@nestjs/common';
import { ConfigBase } from './.base.config';

@Injectable()
export class QueryConfig extends ConfigBase {
  public readonly idMin = this.asNumber('USER_ID_MIN') ?? 1;

  public readonly idMax = this.asNumber('USER_ID_MAX') ?? 10;

  public readonly qty = this.asNumber('USERS_TO_QUERY') ?? 10;
}
