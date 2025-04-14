import { ModuleMetadata } from '@nestjs/common';
import { PyroscopeConfig} from '@pyroscope/nodejs';

export { PyroscopeConfig };

export interface PyroscopeAsyncOpts
  extends Pick<ModuleMetadata, 'imports' | 'providers'>
{
  global?: boolean;
  inject?: any[];
  useFactory: (...args: any[]) => PyroscopeConfig | Promise<PyroscopeConfig>;
}
