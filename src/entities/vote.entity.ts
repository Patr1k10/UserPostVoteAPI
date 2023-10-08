import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Vote {
  @ApiProperty({ description: 'The ID of the vote' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The value of the vote' })
  @Column()
  value: number;

  @ApiProperty({ description: 'Username of the voter' })
  @Column()
  fromUsername: string;

  @ApiProperty({ description: 'Username of the one being voted for' })
  @Column()
  toUsername: string;

  @ApiProperty({ description: 'Is the vote deleted?' })
  @Column({ default: false })
  is_deleted: boolean;

  @ApiProperty({ description: 'Timestamp of when the vote was deleted' })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ description: 'Timestamp of when the vote was created' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Timestamp of the last time the vote was updated' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
