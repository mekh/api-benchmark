import { ApolloDriver } from '@nestjs/apollo';
import { DynamicModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver } from '@nestjs/mercurius';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfig, GqlDriver } from './config/app.config';
import { ConfigModule } from './config/config.module';
import { DbConfig } from './config/db.config';
import { GraphqlConfig } from './config/graphql.cofig';
import { PyroscopeConfig } from './config/pyroscope.config';
import { PyroscopeModule } from './lib/pyroscope';
import { ActionEntity } from './entities/action.entity';
import { PermissionEntity } from './entities/permission.entity';
import { ResourceEntity } from './entities/resource.entity';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserQueryResolver } from './resolvers/user-query.resolver';
import { UserController } from './controllers/user.controller';

@Module({})
export class AppModule {
  public static forRoot(driver?: GqlDriver): DynamicModule {
    const useApollo = driver === 'apollo';

    return {
      module: AppModule,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [DbConfig],
          useFactory: (conf: DbConfig) => {
            return conf;
          },
        }),
        TypeOrmModule.forFeature([
          ActionEntity,
          PermissionEntity,
          ResourceEntity,
          RoleEntity,
          UserEntity,
        ]),
        GraphQLModule.forRootAsync({
          driver: useApollo ? ApolloDriver : MercuriusDriver,
          imports: [ConfigModule],
          inject: [GraphqlConfig],
          useFactory(conf: GraphqlConfig) {
            return useApollo ? conf.apolloConfig : conf.mercuriusConfig;
          },
        }),
        PyroscopeModule.forRootAsync({
          global: true,
          imports: [ConfigModule],
          inject: [PyroscopeConfig, AppConfig],
          useFactory: (conf: PyroscopeConfig, { appName }: AppConfig) => {
            const config = conf.getConfig();
            config.appName = appName;

            return config;
          },
        }),
      ],
      providers: [UserQueryResolver, UserRepository],
      controllers: [UserController],
    };
  }
}
