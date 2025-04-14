import { Injectable } from '@nestjs/common';
import { PyroscopeConfig as IConfig } from '@pyroscope/nodejs';

import { ConfigBase } from './_base.config';

@Injectable()
export class PyroscopeConfig extends ConfigBase {
  public getConfig(): IConfig {
    return {
      authToken: this.authToken,
      flushIntervalMs: this.flushIntervalMs,
      serverAddress: this.serverAddress,
      basicAuthUser: this.basicAuthUser,
      basicAuthPassword: this.basicAuthPassword,
      tenantID: this.tenantID,
      wall: {
        samplingDurationMs: this.samplingDurationMs,
        samplingIntervalMicros: this.samplingIntervalMicros,
        collectCpuTime: this.collectCpuTime,
      },
      heap: {
        stackDepth: this.stackDepth,
        samplingIntervalBytes: this.samplingIntervalBytes,
      },
    };
  }

  public readonly enabled = this.asBoolean('PYROSCOPE_ENABLED') ?? false;

  public readonly host = this.asString('PYROSCOPE_HOST');

  public readonly port = this.asNumber('PYROSCOPE_PORT');

  public readonly serverAddress = this.host
    ? `http://${this.host}${this.port ? `:${this.port}` : ''}`
    : undefined;

  public readonly authToken = this.asString('PYROSCOPE_AUTH_TOKEN');

  public readonly basicAuthUser = this.asString('PYROSCOPE_AUTH_USER');

  public readonly basicAuthPassword = this.asString('PYROSCOPE_AUTH_PASSWORD');

  public readonly tenantID = this.asString('PYROSCOPE_TENANT_ID');

  /**
   * Interval when profiles are sent to the server (Default 60000)
   */
  public readonly flushIntervalMs = this.asNumber('PYROSCOPE_FLUSH_MS');

  /**
   * Average number of bytes between samples. (Default 524288)
   */
  public readonly samplingIntervalBytes =
    this.asNumber('PYROSCOPE_HEAP_SAMPLING_INTERVAL_BYTES');

  /**
   * Maximum stack depth for heap samples (Default 64)
   */
  public readonly stackDepth =
    this.asNumber('PYROSCOPE_HEAP_STACK_DEPTH');

  /**
   * Duration of a single wall profile (Default 60000)
   */
  public readonly samplingDurationMs =
    this.asNumber('PYROSCOPE_WALL_SAMPLING_DURATION_MS');

  /**
   * Interval of how often wall samples are collected (Default 10000, i.e. 100 sample per second)
   */
  public readonly samplingIntervalMicros =
    this.asNumber('PYROSCOPE_WALL_SAMPLING_INTERVAL_MCS');

  /**
   * Required for CPU profiling.
   * Enable CPU time collection as part of the wall profiler (Default false)
   */
  public readonly collectCpuTime =
    this.asBoolean('PYROSCOPE_WALL_COLLECT_CPU_TIME');
}
