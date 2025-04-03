import { Injectable } from '@nestjs/common';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { MercuriusDriverConfig } from '@nestjs/mercurius';

import { ConfigBase } from './.base.config';

@Injectable()
export class GraphqlConfig extends ConfigBase {
  private readonly common = {
    sortSchema: true,
    autoSchemaFile: true,
    introspection: true,
  };

  public readonly apolloConfig: ApolloDriverConfig = {
    ...this.common,
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
  };

  public readonly mercuriusConfig: MercuriusDriverConfig = {
    ...this.common,
    graphiql: true,
  };
}
