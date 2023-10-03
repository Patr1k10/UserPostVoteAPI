import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: number;

  @Column()
  fromUsername: string; // Добавлено

  @Column()
  toUsername: string; // Добавлено

  @Column({ default: false }) // Добавлено
  is_deleted: boolean; // Добавлено

  @Column({ type: 'timestamp', nullable: true }) // Добавлено
  deletedAt: Date | null; // Добавлено

  @CreateDateColumn({ type: 'timestamp' }) // Добавлено
  createdAt: Date; // Добавлено

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
