import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class User {
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

  @Column({
    type: 'enum',
    enum: ['admin', 'moderator'],
    default: 'moderator',
  })
  role: string;

  @Column({ default: 0 })
  rating: number;

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
