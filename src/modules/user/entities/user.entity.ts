import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  AfterInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Post } from '@modules/post/entities/post.entity';
import { Role } from '@/modules/auth/entities/role.entity';
import { RoleEnum } from '@/shared/constants/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { nullable: false, length: 30, unique: true })
  username: string;

  @Column('varchar', { nullable: false, length: 255, unique: true })
  email: string;

  @Column('varchar', { nullable: false, length: 255, select: false })
  password: string;

  @Column('nvarchar', { name: 'display_name', nullable: false, length: 50 })
  displayName: string;

  @Column('nvarchar', { default: null, length: 200 })
  biography: string;

  @Column('varchar', { name: 'avatar_image', default: null })
  avatarImage: string;

  @Column('varchar', { name: 'banner_image', default: null })
  bannerImage: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt: Date;

  @OneToMany(() => Post, (post: Post) => post.user)
  posts: Post[];

  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_follower',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'follower_id' },
  })
  followers: User[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(password: string): Promise<void> {
    const salt: string = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  @BeforeInsert()
  assignDisplayNameIfNull(): void {
    if (this.displayName && this.displayName !== '') return;

    this.displayName = this.username;
  }

  // @BeforeInsert()
  // async assignRoleBeforeInsert(): Promise<void> {
  //   const role: Role = await Role.findOne({
  //     where: { name: RoleEnum.USER },
  //   });
  //   this.roles = [role];
  // }

  @AfterInsert()
  async assignRole(): Promise<void> {
    const role: Role = await Role.findOne({
      where: { name: RoleEnum.USER },
      relations: { users: true },
    });

    role.users.push(this);
    role.save();
  }
}
