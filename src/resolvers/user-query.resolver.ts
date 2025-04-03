import { Pool } from 'pg';
import { OnModuleInit } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { DbConfig } from '../config/db.config';
import { UserEntity } from '../entities/user.entity';
import { RawData, UserRepository } from '../repositories/user.repository';

@Resolver(() => UserEntity)
export class UserQueryResolver implements OnModuleInit {
  private pg!: Pool;

  constructor(
    private readonly userRepo: UserRepository,
    private readonly dbConfig: DbConfig,
  ) {}

  onModuleInit(): void {
    this.pg = new Pool({
      host: this.dbConfig.host,
      port: this.dbConfig.port,
      user: this.dbConfig.username,
      password: this.dbConfig.password,
      database: this.dbConfig.database,
      keepAlive: this.dbConfig.keepConnectionAlive,
    });
  }

  @Query(() => [UserEntity])
  public async ormJoin(): Promise<UserEntity[]> {
    return this.userRepo.ormJoin();
  }

  @Query(() => [UserEntity])
  public async rawJoin(): Promise<UserEntity[]> {
    return this.userRepo.rawJoin();
  }

  @Query(() => [UserEntity])
  public async pgJoin(): Promise<UserEntity[]> {
    const query = this.userRepo.getRawQuery();
    const data = await this.pg.query<RawData>(query);

    return this.userRepo.rawToUser(data.rows);
  }
}
