import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { SignUpDTO } from '@/modules/auth/dto/sign-up.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  private findOptionRelations: FindOptionsRelations<User> = {
    posts: true,
  };

  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  getAll(): Promise<User[]> {
    return this.find({
      relations: this.findOptionRelations,
    });
  }

  // mostly used for authentication
  getById(id: string): Promise<User> {
    return this.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  getByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      relations: this.findOptionRelations,
    });
  }

  getByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      relations: this.findOptionRelations,
    });
  }

  getAccountByUsername(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      select: { id: true, username: true, password: true },
    });
  }

  getAccountByEmail(email: string): Promise<User> {
    return this.findOne({
      where: { email },
      select: { id: true, email: true, password: true },
    });
  }

  // #region TODO: consider remove user-role table
  async addUser(signUpDto: SignUpDTO): Promise<User> {
    const user: User = this.create(signUpDto);
    const newUser: User = await this.save(user);

    return newUser;
  }

  // async updateById(id: string, userDto: UserDTO): Promise<boolean> {
  //   const user: User = await this.getById(id);
  //   const userToUpdate: User = Object.assign(user, userDto);
  //   const updatedUser: User = await this.save(userToUpdate);
  //   if (!updatedUser) return false;

  //   return true;
  // }

  // #endregion

  async deleteById(id: string): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    return deleteResult.affected !== 0;
  }
}
