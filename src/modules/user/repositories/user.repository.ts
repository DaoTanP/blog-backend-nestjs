import { Injectable } from '@nestjs/common';
import { DataSource, FindOptionsRelations, Repository } from 'typeorm';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  private findOptionRelations: FindOptionsRelations<User> = {
    address: true,
    company: true,
  };

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAll(): Promise<User[]> {
    return this.find();
  }

  async getById(id: number): Promise<User> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async getAccountByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      select: { username: true, password: true },
    });
  }

  async getAccountByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      select: { email: true, password: true },
    });
  }

  async getByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      relations: this.findOptionRelations,
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      relations: this.findOptionRelations,
    });
  }
}
