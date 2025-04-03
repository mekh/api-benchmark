import { Injectable } from '@nestjs/common';
import { ConfigBase } from './.base.config';

@Injectable()
export class QueryConfig extends ConfigBase {
  private readonly idMin = this.asNumber('USER_ID_MIN') ?? 1;

  private readonly idMax = this.asNumber('USER_ID_MAX') ?? 10;

  private readonly qty = this.asNumber('USERS_TO_QUERY') ?? 10;

  private readonly ids: number[];

  constructor() {
    super();

    this.ids = this.buildArr();
  }

  public randomizeIds(): number[] {
    const { idMin, idMax, qty, ids } = this;

    const rangeSize = idMax - idMin + 1;
    const size = Math.min(rangeSize, qty);

    // Fisher–Yates shuffle
    for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * (rangeSize - i)) + i;
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    return ids.slice(0, size);
  }

  private buildArr() {
    if (this.idMin > this.idMax) {
      throw new Error('idMin should be <= idMax');
    }

    if (this.qty <= 0) {
      throw new Error('qty should be > 0');
    }

    const rangeSize = this.idMax - this.idMin + 1;

    return Array.from({ length: rangeSize }, (_, i) => this.idMin + i);
  }
}
