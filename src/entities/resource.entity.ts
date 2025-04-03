import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from './_base.entity';
import { PermissionEntity } from './permission.entity';

@ObjectType()
@Entity('resource')
export class ResourceEntity extends BaseEntity {
  @Field()
  @Column({ length: 25, nullable: false })
  @Index('resource_name_uindex', { unique: true })
  public name!: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  public description?: string;

  @OneToMany(
    'PermissionEntity',
    (permission: PermissionEntity) => permission.resource,
    { onDelete: 'CASCADE' },
  )
  public permissions?: PermissionEntity[];
}
