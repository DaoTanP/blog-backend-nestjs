import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async getAll() {
    return this.find();
  }

  async getById(id: number) {
    return this.findOne({ where: { id } });
  }
}
