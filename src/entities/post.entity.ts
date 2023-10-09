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
import { IRatable } from '../interface/rateble.interface';

@Entity()
export class Post implements IRatable {
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

  @CreateDateColumn({ type: 'timestamp' })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
