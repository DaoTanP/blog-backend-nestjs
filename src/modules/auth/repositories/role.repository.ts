import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '@modules/auth/entities/role.entity';
import { RoleEnum } from '@shared/constants/role.enum';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  getAll(): Promise<Role[]> {
    return this.find();
  }

  getById(id: string): Promise<Role> {
    return this.findOne({ where: { id } });
  }

  getByName(roleName: RoleEnum): Promise<Role> {
    return this.findOne({ where: { name: roleName } });
  }
}
