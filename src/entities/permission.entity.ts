import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToMany, ManyToOne } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { ActionEntity } from './action.entity';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';

@ObjectType()
@Entity('permission')
@Index(['resourceId', 'actionId'], { unique: true })
export class PermissionEntity extends BaseEntity {
  @Field(() => Int)
  @Column({
    type: 'int',
    unsigned: true,
    foreignKeyConstraintName: 'permission_resource_id_fk',
  })
  public resourceId!: number;

  @Field(() => Int)
  @Column({
    type: 'int',
    unsigned: true,
    foreignKeyConstraintName: 'permission_action_id_fk',
  })
  public actionId!: number;

  @ManyToOne('ResourceEntity', { onDelete: 'CASCADE' })
  @Field(() => ResourceEntity)
  public resource!: ResourceEntity;

  @ManyToOne('ActionEntity', { onDelete: 'CASCADE' })
  @Field(() => ActionEntity)
  public action!: ActionEntity;

  @ManyToMany('RoleEntity', (role: RoleEntity) => role.permissions, {
    onDelete: 'CASCADE',
  })
  public roles?: RoleEntity[];
}
