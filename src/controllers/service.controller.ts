import { Controller, Get } from '@nestjs/common';
import * as process from 'node:process';

@Controller()
export class ServiceController {
  @Get('health')
  public health() {
    return 'ok';
  }

  @Get('info')
  public info() {
    return { pod: process.env.HOSTNAME, pid: process.pid };
  }
}
