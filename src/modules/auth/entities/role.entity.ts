import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { UserRoles } from '@modules/auth/enums/role.enum';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
  id: number;

  // @Column('varchar', { nullable: false, length: 255 })
  // name: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
    nullable: false,
  })
  name: UserRoles;
}
