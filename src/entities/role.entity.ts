import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { PermissionEntity } from './permission.entity';
import type { UserEntity } from './user.entity';

@ObjectType()
@Entity('role')
export class RoleEntity extends BaseEntity {
  @Field()
  @Column({ length: 25, nullable: false })
  @Index('role_name_uindex', { unique: true })
  public name!: string;

  @Field()
  @Column({ type: 'boolean', nullable: false, default: false })
  public active!: boolean;

  @ManyToMany('UserEntity', (user: UserEntity) => user?.roles, {
    onDelete: 'CASCADE',
  })
  public users?: UserEntity[];

  @ManyToMany('PermissionEntity', (perm: PermissionEntity) => perm.roles, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'roleId',
      foreignKeyConstraintName: 'role_permission_role_id_fk',
    },
    inverseJoinColumn: {
      name: 'permissionId',
      foreignKeyConstraintName: 'role_permission_permission_id_fk',
    },
  })
  @Field(() => [PermissionEntity])
  public permissions?: PermissionEntity[];
}
