import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { RoleEntity } from './role.entity';

@ObjectType()
@Entity('user')
export class UserEntity extends BaseEntity {
  @Field()
  @Index('user_guid_uindex', { unique: true })
  @Column({ length: 36 })
  public guid!: string;

  @Field()
  @Column({ length: 32, nullable: false })
  public name!: string;

  @Field()
  @Column({ length: 255, nullable: false })
  @Index('user_email_uindex', { unique: true })
  public email!: string;

  @Field()
  @Column({ length: 255, nullable: false })
  public password!: string;

  @Field()
  @Column({ type: 'boolean', default: false })
  public active!: boolean;

  @Field()
  @Column({ type: 'boolean', default: false })
  public isAdmin!: boolean;

  @ManyToMany('RoleEntity', (role: RoleEntity) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'userId',
      foreignKeyConstraintName: 'user_role_user_id_fk',
    },
    inverseJoinColumn: {
      name: 'roleId',
      foreignKeyConstraintName: 'user_role_role_id_fk',
    },
  })
  @Field(() => [RoleEntity])
  public roles?: RoleEntity[];
}
