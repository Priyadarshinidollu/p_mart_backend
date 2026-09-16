import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from '../../auth/roles.enum.js';

@Entity({})
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, default: Role.Customer })
  role: Role;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({nullable:true})
  password: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  gender: string;

  @Column({type:'timestamp'})
  dateOfBirth: Date;

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
