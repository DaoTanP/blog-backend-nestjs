import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Company } from './company.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { name: 'first_name', nullable: false, length: 255 })
  firstName: string;

  @Column('varchar', { name: 'last_name', nullable: false, length: 255 })
  lastName: string;

  @Column('varchar', { nullable: false, length: 255 })
  username: string;

  @Column('varchar', { nullable: false, length: 255 })
  password: string;

  @Column('varchar', { nullable: false, length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  phone: string;

  @Column('varchar', { length: 255 })
  website: string;

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

  @ManyToOne(() => Address, (address: Address) => address.users, {
    cascade: true,
  })
  @JoinColumn({ name: 'address_id', foreignKeyConstraintName: 'fk_address' })
  address: Address;

  @ManyToOne(() => Company, (company: Company) => company.users, {
    cascade: true,
  })
  @JoinColumn({ name: 'company_id', foreignKeyConstraintName: 'fk_company' })
  company: Company;
}
