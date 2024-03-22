import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';
import { AddressRepository } from './repositories/address.repository';
import { CompanyRepository } from './repositories/company.repository';
import { GeoRepository } from './repositories/geo.repository';
import { Address } from './entities/address.entity';
import { Company } from './entities/company.entity';
import { Messages } from '@/shared/constants/messages.constant';
import { UserRoleService } from '../auth/services/user-role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly addressRepository: AddressRepository,
    private readonly geoRepository: GeoRepository,
    private readonly companyRepository: CompanyRepository,
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

  async deleteById(id: number): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }

  async addUser(userDto: UserDTO): Promise<unknown> {
    let address: Address = await this.addressRepository.get(userDto.address);
    let company: Company = await this.companyRepository.get(userDto.company);

    if (!address)
      address = await this.addressRepository.getWithoutGeo(userDto.address);

    if (!address) address = await this.addressRepository.add(userDto.address);

    if (!company) company = await this.companyRepository.add(userDto.company);

    userDto.address = address;
    userDto.company = company;

    return this.userRepository.addUser(userDto);
  }

  async giveAdmin(username: string): Promise<Object> {
    try {
      const user = await this.getAccountByUsername(username);
      if (!user) { throw new NotFoundException(Messages.USER_NOT_FOUND); }

      await this.userRoleService.giveAdminRole(user.id);

      const userData = await this.userRepository.save(user);
      return {
        statusCode: HttpStatus.OK,
        message: username + Messages.GIVE_ADMIN,
        data: userData,
      };
    }
    catch (error) {
      throw error instanceof HttpException ? error : new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }

  async takeAdmin(username: string): Promise<Object> {
    try {
      const user = await this.getAccountByUsername(username);
      if (!user) { throw new NotFoundException(Messages.USER_NOT_FOUND); }

      await this.userRoleService.takeAdminRole(user.id);

      const userData = await this.userRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: username + Messages.TASK_ADMIN,
        data: userData,
      };
    }
    catch (error) {
      throw error instanceof HttpException ? error : new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }

}
