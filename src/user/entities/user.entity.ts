import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  constructor(username: string, firstName: string, lastName: string, password: string) {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }
}
