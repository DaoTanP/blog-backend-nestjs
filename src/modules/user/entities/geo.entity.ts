import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('geo')
export class Geo extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { length: 255 })
  lat: string;

  @Column('varchar', { length: 255 })
  lng: string;

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
}
