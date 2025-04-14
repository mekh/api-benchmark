import { DynamicModule, Module, Provider } from '@nestjs/common';

import { PYROSCOPE_CONFIG } from './pyroscope.constants';
import { PyroscopeService } from './pyroscope.service';

import { PyroscopeAsyncOpts } from './pyroscope.interfaces';

@Module({})
export class PyroscopeModule {
  public static forRootAsync(opts: PyroscopeAsyncOpts): DynamicModule {
    const configProvider: Provider = {
      provide: PYROSCOPE_CONFIG,
      useFactory: opts.useFactory,
      inject: opts.inject,
    };

    return {
      module: PyroscopeModule,
      global: opts.global,
      imports: opts.imports,
      providers: [
        configProvider,
        PyroscopeService,
      ],
      exports: [
        PyroscopeService,
      ],
    };
  }
}
