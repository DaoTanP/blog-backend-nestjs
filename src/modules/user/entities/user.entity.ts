import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Address } from './address.entity';
import { Company } from './company.entity';
import * as bcrypt from 'bcrypt';
import { Post } from '@/modules/post/entities/post.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  // @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { name: 'first_name', nullable: false, length: 255 })
  firstName: string;

  @Column('varchar', { name: 'last_name', nullable: false, length: 255 })
  lastName: string;

  @Column('varchar', { nullable: false, length: 255, unique: true })
  username: string;

  @Column('varchar', { nullable: false, length: 255, select: false })
  password: string;

  @Column('varchar', { nullable: false, length: 255, unique: true })
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
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'address_id', foreignKeyConstraintName: 'fk_address' })
  address: Address;

  @ManyToOne(() => Company, (company: Company) => company.users, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id', foreignKeyConstraintName: 'fk_company' })
  company: Company;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @BeforeInsert()
  async hashPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
