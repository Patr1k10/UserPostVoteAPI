import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './users.entity';
import { IRatable } from '../interface/rateble.interface';

@ObjectType()
@Entity()
export class Post implements IRatable {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id: number;

  @Field()
  @Column({ length: 500 })
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field()
  @Column({ default: 0 })
  rating: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @Field()
  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;

  @Field()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
