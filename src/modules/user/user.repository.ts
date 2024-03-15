import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAll() {
    return this.find();
  }

  async getById(id: number) {
    return this.findOne({ where: { id }, relations: ['address', 'company'] });
  }

  async getByUsername(username: string) {
    return this.findOne({
      where: { username },
      relations: ['address', 'company'],
    });
  }

  async getByEmail(email: string) {
    return this.findOne({ where: { email } });
  }
}
