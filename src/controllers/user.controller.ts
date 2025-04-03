import { Controller, Get } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Controller()
export class UserController {
  constructor(private readonly userRepo: UserRepository) {}

  @Get('ormJoin')
  public async ormJoin(): Promise<UserEntity[]> {
    return this.userRepo.ormJoin();
  }

  @Get('rawJoin')
  public async rawJoin(): Promise<UserEntity[]> {
    return this.userRepo.rawJoin();
  }
}
