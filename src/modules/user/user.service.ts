import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';
import { UserRoles } from '@/shared/constants/role.enum';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { UserRoleService } from '@modules/auth/services/user-role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleService: UserRoleService,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  async getById(id: number): Promise<User> {
    return this.userRepository.getById(id);
  }

  async getAccountByUsername(username: string): Promise<User> {
    return this.userRepository.getAccountByUsername(username);
  }

  async getAccountByEmail(email: string): Promise<User> {
    return this.userRepository.getAccountByEmail(email);
  }

  async getByUsername(username: string): Promise<User> {
    return this.userRepository.getByUsername(username);
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email);
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user: User = await this.userRepository.getByUsername(username);

    return user ? false : true;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user: User = await this.userRepository.getByEmail(email);

    return user ? false : true;
  }

  async hasPermission(username: string, user: User): Promise<boolean> {
    const userRole: UserRole = await this.userRoleService.getByUserId(user.id);
    if (user.username !== username && userRole.role.name !== UserRoles.ADMIN)
      return false;

    return true;
  }

  async deleteById(id: number): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }

  async updateById(id: number, userDto: UserDTO): Promise<boolean> {
    return this.userRepository.updateById(id, userDto);
  }

  async addUser(userDto: UserDTO): Promise<unknown> {
    return this.userRepository.addUser(userDto);
  }
}
