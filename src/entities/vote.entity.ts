import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field()
  value: number;

  @Column()
  @Field()
  fromUserId: number;

  @Column()
  @Field()
  entityId: number;

  @Column()
  @Field()
  entityType: string;

  @Field()
  @Column({ default: false })
  is_deleted: boolean;

  @Field()
  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
