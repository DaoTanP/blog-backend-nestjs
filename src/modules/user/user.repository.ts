import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private findOptionRelations: FindOptionsRelations<User> = {
    address: true,
    company: true,
  };

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAll() {
    return this.find();
  }

  async getById(id: number) {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async getAccountByUsername(username: string) {
    return this.findOne({
      where: { username },
      select: { username: true, password: true },
    });
  }

  async getAccountByEmail(email: string) {
    return this.findOne({
      where: { email },
      select: { email: true, password: true },
    });
  }

  async getByUsername(username: string) {
    return this.findOne({
      where: { username },
      relations: this.findOptionRelations,
    });
  }

  async getByEmail(email: string) {
    return this.findOne({
      where: { email },
      relations: this.findOptionRelations,
    });
  }
}
