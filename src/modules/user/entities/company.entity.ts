import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('company')
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { name: 'catch_phrase', length: 255 })
  catchPhrase: string;

  @Column('varchar', { length: 255 })
  bs: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @Column('bigint', {
    name: 'created_by',
    unsigned: true,
    default: null,
    select: false,
  })
  createdBy: Date;

  @Column('bigint', {
    name: 'updated_by',
    unsigned: true,
    default: null,
    select: false,
  })
  updatedBy: Date;

  @OneToMany(() => User, (user: User) => user.company)
  users: User[];
}
