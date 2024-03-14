import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from './userRole.entity';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(private dataSource: DataSource) {
    super(UserRole, dataSource.createEntityManager());
  }

  async getAll() {
    return this.find();
  }

  async getById(id: number) {
    return this.findOne({ where: { id } });
  }
}
