import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAll() {
    return this.userRepository.getAll();
  }

  async getById(id: number) {
    return this.userRepository.getById(id);
  }

  async getByUsername(username: string) {
    return this.userRepository.getByUsername(username);
  }

  async getByEmail(email: string) {
    return this.userRepository.getByEmail(email);
  }

  async isUsernameAvailable(username: string) {
    const user = await this.userRepository.getByUsername(username);

    return user ? false : true;
  }

  async isEmailAvailable(email: string) {
    const user = await this.userRepository.getByEmail(email);

    return user ? false : true;
  }
}
