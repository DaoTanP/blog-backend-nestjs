import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserRoleService } from '@modules/auth/services/user-role.service';

@Injectable()
export class UserRepository extends Repository<User> {
  private findOptionRelations: FindOptionsRelations<User> = {
    address: {
      geo: true,
    },
    company: true,
  };

  constructor(
    private dataSource: DataSource,
    private readonly userRoleService: UserRoleService,
  ) {
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
      select: { id: true, username: true, password: true },
    });
  }

  async getAccountByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
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

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
