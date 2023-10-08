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
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  rating: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @CreateDateColumn({ type: 'timestamp', select: false })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
