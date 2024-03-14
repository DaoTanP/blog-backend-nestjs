import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Role } from './role.entity';

@Entity('user_role')
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'user_id',
    foreignKeyConstraintName: 'fk_security_user_id',
  })
  user: User;

  @OneToOne(() => Role)
  @JoinColumn({
    name: 'role_id',
    foreignKeyConstraintName: 'fk_security_role_id',
  })
  role: Role;
}
