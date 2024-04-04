import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { User } from '@modules/user/entities/user.entity';
import { Role } from '@modules/auth/entities/role.entity';
import { UserRoles } from '@/shared/constants/role.enum';
import { RoleRepository } from './role.repository';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(
    private dataSource: DataSource,
    private readonly roleRepository: RoleRepository,
  ) {
    super(UserRole, dataSource.createEntityManager());
  }

  async getAll(): Promise<UserRole[]> {
    return this.find();
  }

  async getById(id: number): Promise<UserRole> {
    return this.findOne({ where: { id } });
  }

  async getByUserId(userId: number): Promise<UserRole> {
    return this.findOne({
      where: { user: { id: userId } },
      relations: { user: true, role: true },
    });
  }

  async add(user: User, roleName: UserRoles): Promise<UserRole> {
    const role: Role = await this.roleRepository.getByName(roleName);
    const userRole: UserRole = this.create({ user, role });

    return this.save(userRole);
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({
      user: { id: userId },
    });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
