import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';
import { IRatable } from '../interface/rateble.interface';

@Entity()
export class User implements IRatable {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'moderator'],
    default: 'moderator',
  })
  role: string;

  @Column({ default: 0 })
  rating: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Promise<Post[]>;

  @CreateDateColumn({ type: 'timestamp', select: false })
  created_at?: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  constructor(username: string, firstName: string, lastName: string, password: string, role: string) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
    this.role = role;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
