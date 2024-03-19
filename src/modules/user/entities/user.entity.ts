import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Address } from './address.entity';
import { Company } from './company.entity';
import * as bcrypt from 'bcrypt';

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

  @Column('varchar', { nullable: false, length: 255, select: false })
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
    select: false,
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
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

  @BeforeInsert()
  async hashPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
