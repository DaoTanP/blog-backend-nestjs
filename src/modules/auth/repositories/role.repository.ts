import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '@modules/auth/entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getAll(): Promise<Role[]> {
    return this.find();
  }

  async getById(id: number): Promise<Role> {
    return this.findOne({ where: { id } });
  }
}
