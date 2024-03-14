import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';

@Entity('address')
export class Address extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255 })
  street: string;

  @Column('varchar', { length: 255 })
  suite: string;

  @Column('varchar', { length: 255 })
  city: string;

  @Column('varchar', { length: 255 })
  zipcode: string;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('bigint', { name: 'created_by', unsigned: true, default: null })
  createdBy: Date;

  @Column('bigint', { name: 'updated_by', unsigned: true, default: null })
  updatedBy: Date;

  @OneToMany(() => User, (user: User) => user.address)
  users: User[];
}
