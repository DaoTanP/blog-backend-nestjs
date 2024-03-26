import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';

@Entity('posts')
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @Column('varchar', { nullable: false, length: 255 })
  title: string;

  @Column('text', { nullable: false })
  body: string;

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
  createdBy: number;

  @Column('bigint', {
    name: 'updated_by',
    unsigned: true,
    default: null,
    select: false,
  })
  updatedBy: number;

  @ManyToOne(() => User, (user: User) => user.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_user_post' })
  user: User;
}
