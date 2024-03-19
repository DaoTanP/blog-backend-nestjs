import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '@/modules/auth/entities/user-role.entity';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(private dataSource: DataSource) {
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
}
