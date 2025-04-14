import Pyroscope from '@pyroscope/nodejs';
import { Inject, Injectable } from '@nestjs/common';

import { PYROSCOPE_CONFIG } from './pyroscope.constants';

import { PyroscopeConfig } from './pyroscope.interfaces';

@Injectable()
export class PyroscopeService {
  private pyroscope: typeof Pyroscope;

  constructor(
    @Inject(PYROSCOPE_CONFIG) config: PyroscopeConfig,
  ) {
    this.pyroscope = Pyroscope;
    this.pyroscope.init(config);
  }

  public start(): void {
    this.pyroscope.start();
  }

  public startCpuProfiling(): void {
    this.pyroscope.startCpuProfiling();
  }

  public startWallProfiling(): void {
    this.pyroscope.startWallProfiling();
  }

  public startHeapProfiling(): void {
    this.pyroscope.startHeapProfiling();
  }
}
