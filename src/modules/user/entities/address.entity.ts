import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Geo } from './geo.entity';

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

  @OneToOne(() => Geo, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({
    name: 'geo_id',
    foreignKeyConstraintName: 'fk_geo',
  })
  geo: Geo;

  @OneToMany(() => User, (user: User) => user.address)
  users: User[];
}
