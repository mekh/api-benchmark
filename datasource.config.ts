import 'dotenv/config';
import { DataSource } from 'typeorm';

import { DbConfig } from './src/config/db.config';

const config = new DbConfig();

export const datasource = new DataSource({
  ...config,
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*.*'],
});
