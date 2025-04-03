import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  public id!: number;

  @Field()
  @CreateDateColumn({
    precision: null,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn({
    precision: null,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt!: Date;
}
