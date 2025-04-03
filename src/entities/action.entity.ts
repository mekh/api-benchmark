import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { type PermissionEntity } from './permission.entity';

@ObjectType()
@Entity('action')
export class ActionEntity extends BaseEntity {
  @Field()
  @Column({ length: 25, nullable: false })
  @Index('action_name_uindex', { unique: true })
  public name!: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  public description?: string;

  @OneToMany(
    'PermissionEntity',
    (permission: PermissionEntity) => permission.action,
    { onDelete: 'CASCADE' },
  )
  public permissions?: PermissionEntity[];
}
