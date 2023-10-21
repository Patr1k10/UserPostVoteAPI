import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from './post.entity';
import { IRatable } from '../interface/rateble.interface';

@Unique(['username', 'deleted_at'])
@Directive('@key(fields: "id")')
@ObjectType()
@Entity()
export class User implements IRatable {
  @PrimaryGeneratedColumn('increment')
  @Field(() => ID)
  id?: number;

  @Field()
  @Column()
  username?: string;

  @Field()
  @Column()
  firstName?: string;

  @Field()
  @Column()
  lastName?: string;

  @Field()
  @Column()
  password?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Field()
  @Column({
    type: 'enum',
    enum: ['admin', 'moderator'],
    default: 'moderator',
  })
  role?: string;

  @Field()
  @Column({ default: 0 })
  rating?: number;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.user)
  posts?: Promise<Post[]>;

  @Field()
  @CreateDateColumn({ type: 'timestamp', select: false })
  created_at?: Date;

  @Field()
  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at?: Date;

  @Field()
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at?: Date | null;

  // constructor(username: string, firstName: string, lastName: string, password: string, role: string) {
  //   this.username = username;
  //   this.firstName = firstName;
  //   this.lastName = lastName;
  //   this.password = password;
  //   this.role = role;
  //   this.created_at = new Date();
  //   this.updated_at = new Date();
  // }
}
