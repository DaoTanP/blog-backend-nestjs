import { Injectable } from '@nestjs/common';
import { UserRoleRepository } from '@modules/auth/repositories/userRole.repository';
import { UserRole } from '@/modules/auth/entities/user-role.entity';

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
}
