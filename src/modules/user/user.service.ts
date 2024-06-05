import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getAll(): Promise<User[]> {
    return this.userRepository.getAll();
  }

  getById(id: string): Promise<User> {
    return this.userRepository.getById(id);
  }

  getByUsername(username: string): Promise<User> {
    return this.userRepository.getByUsername(username);
  }

  getByEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email);
  }

  getAccountByUsername(username: string): Promise<User> {
    return this.userRepository.getAccountByUsername(username);
  }

  getAccountByEmail(email: string): Promise<User> {
    return this.userRepository.getAccountByEmail(email);
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const user: User = await this.userRepository.getAccountByUsername(username);

    return user === null;
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    const user: User = await this.userRepository.getAccountByEmail(email);

    return user === null;
  }

  deleteById(id: string): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }

  updateById(id: string, updateUserDTO: UpdateUserDTO): Promise<User> {
    return this.userRepository.updateById(id, updateUserDTO);
  }

  addUser(signUpDTO: SignUpDTO): Promise<User> {
    return this.userRepository.addUser(signUpDTO);
  }

  async giveAdmin(username: string): Promise<any> {
    const user: User = await this.getByUsername(username);
    return user;
  }

  async takeAdmin(username: string): Promise<any> {
    const user: User = await this.getByUsername(username);
    return user;
  }

  getFollowers(id: string): Promise<User[]> {
    return this.userRepository.getFollowers(id);
  }

  getFollowing(id: string): Promise<User[]> {
    return this.userRepository.getFollowing(id);
  }

  followUser(followerId: string, userId: string): Promise<boolean> {
    return this.userRepository.followUser(followerId, userId);
  }

  unfollowUser(followerId: string, userId: string): Promise<boolean> {
    return this.userRepository.unfollowUser(followerId, userId);
  }
}
