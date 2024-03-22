import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRoleRepository } from '@modules/auth/repositories/user-role.repository';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { UserRoles } from '@shared/constants/role.enum';
import { User } from '@modules/user/entities/user.entity';
import { Messages } from '@/shared/constants/messages.constant';

@Injectable()
export class UserRoleService {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  async getAll(): Promise<UserRole[]> {
    return this.userRoleRepository.getAll();
  }

  async getById(id: number): Promise<UserRole> {
    return this.userRoleRepository.getById(id);
  }

  async getByUserId(userId: number): Promise<UserRole> {
    return this.userRoleRepository.getByUserId(userId);
  }

  async add(user: User, roleName: UserRoles): Promise<UserRole> {
    return this.userRoleRepository.add(user, roleName);
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    return this.userRoleRepository.deleteByUserId(userId);
  }

  async giveAdminRole(userId: number) {
    const setRole = await this.getByUserId(userId);

    const role = (await setRole).role.name = UserRoles.ADMIN;
    if (!role) { throw new InternalServerErrorException(Messages.USERROLE_NOT_FOUND); }

    this.userRoleRepository.save(setRole);
  }

  async takeAdminRole(userId: number) {
    const setRole = await this.getByUserId(userId);

    const role = (await setRole).role.name = UserRoles.USER;
    if (!role) { throw new InternalServerErrorException(Messages.USERROLE_NOT_FOUND); }

    this.userRoleRepository.save(setRole);
  }
}
