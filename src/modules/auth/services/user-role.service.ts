import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRoleRepository } from '@modules/auth/repositories/user-role.repository';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { UserRoles } from '@shared/constants/role.enum';
import { User } from '@modules/user/entities/user.entity';
import { Messages } from '@/shared/constants/messages.constant';
import { compare } from 'bcrypt';

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
    try {
      const user = await this.getByUserId(userId);
      const role = await user.role;
      if (!role) {
        throw new InternalServerErrorException(Messages.USERROLE_NOT_FOUND);
      }
      const roleName = await role.name;
      if (compare(roleName, UserRoles.ADMIN)) {
        throw new BadRequestException(Messages.USER_IS_ADMIN);
      }
      role.name = UserRoles.ADMIN;

      this.userRoleRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }

  async takeAdminRole(userId: number) {
    try {
      const user = await this.getByUserId(userId);
      const role = await user.role;
      if (!role) {
        throw new InternalServerErrorException(Messages.USERROLE_NOT_FOUND);
      }
      const roleName = await role.name;
      if (!compare(roleName, UserRoles.ADMIN)) {
        throw new BadRequestException(Messages.USER_NOT_ADMIN);
      }
      role.name = UserRoles.USER;

      this.userRoleRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }
}
