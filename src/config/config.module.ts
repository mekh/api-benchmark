import { Module } from '@nestjs/common';
import { AppConfig } from './app.config';
import { DbConfig } from './db.config';
import { GraphqlConfig } from './graphql.cofig';
import { QueryConfig } from './query.config';

const providers = [AppConfig, DbConfig, GraphqlConfig, QueryConfig];

@Module({
  providers,
  exports: providers,
})
export class ConfigModule {}
