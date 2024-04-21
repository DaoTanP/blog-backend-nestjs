import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from 'typeorm';
import { RoleEnum } from '@shared/constants/role.enum';
import { User } from '@/modules/user/entities/user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: false,
  })
  name: RoleEnum;

  @ManyToMany(() => User, (user: User) => user.roles)
  users: User[];
}
