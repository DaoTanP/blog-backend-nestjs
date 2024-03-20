import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { Role } from './role.entity';

@Entity('user_role')
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_security_user_id',
  })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'fk_security_role_id',
  })
  role: Role;
}
