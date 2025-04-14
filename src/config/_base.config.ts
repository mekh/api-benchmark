import * as process from 'node:process';

export class ConfigBase {
  public get env(): Record<string, string | undefined> {
    return process.env;
  }

  public asNumber(envName: string): number | undefined {
    const env = this.env[envName];

    return env ? Number(env) : undefined;
  }

  public asString(envName: string): string | undefined {
    return this.env[envName];
  }

  public asBoolean(envName: string): boolean | undefined {
    const value = this.asString(envName);

    return value && ['true', 'false'].includes(value)
      ? value === 'true'
      : undefined;
  }

  public asEnum(envName: string, values: string[], required: true): string;
  public asEnum(envName: string, values: string[], required?: boolean): string | undefined {
    const value = this.env[envName];

    if (required && !value) {
      throw new Error(`${envName} is required`);
    }

    if (value && !values.includes(value)) {
      throw new Error(`\nunknown value for the "${envName}" env: ${value}\nallowed values are: ${values.join(', ')}`);
    }

    return value;
  }
}
