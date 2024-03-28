import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { UserDTO } from './dto/user.dto';
import { AddressRepository } from './repositories/address.repository';
import { CompanyRepository } from './repositories/company.repository';
import { GeoRepository } from './repositories/geo.repository';
import { Address } from './entities/address.entity';
import { Company } from './entities/company.entity';
import { Geo } from './entities/geo.entity';
import { GeoDTO } from './dto/geo.dto';
import { UserProfileDto } from './dto/userProfile.dto';
import { CompanyDTO } from './dto/company.dto';
import { AddressDTO } from './dto/address.dto';
import { Messages } from '@/shared/constants/messages.constant';
import { UserRoles } from '@shared/constants/role.enum';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { UserRoleService } from '@modules/auth/services/user-role.service';

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

  async giveAdmin(
    username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    try {
      const user = await this.getAccountByUsername(username);
      if (!user) {
        throw new NotFoundException(Messages.USER_NOT_FOUND);
      }

      await this.userRoleService.giveAdminRole(user.id);

      const userData = await this.userRepository.save(user);
      return {
        statusCode: HttpStatus.OK,
        message: Messages.GIVE_ADMIN,
        data: userData,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }

  async takeAdmin(
    username: string,
  ): Promise<{ statusCode: HttpStatus; message: string; data: User }> {
    try {
      const user = await this.getAccountByUsername(username);
      if (!user) {
        throw new NotFoundException(Messages.USER_NOT_FOUND);
      }

      await this.userRoleService.takeAdminRole(user.id);

      const userData = await this.userRepository.save(user);

      return {
        statusCode: HttpStatus.OK,
        message: Messages.TASK_ADMIN,
        data: userData,
      };
    } catch (error) {
      throw error instanceof HttpException
        ? error
        : new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }

  async setOrUpdateInfo(
    userId: number,
    userProfileDto: UserProfileDto,
  ): Promise<unknown> {
    const user = await this.userRepository.getById(userId);
    if (!user) throw new NotFoundException(Messages.USER_NOT_FOUND);

    const geoDto: GeoDTO = { lat: userProfileDto.lat, lng: userProfileDto.lng };
    const companyDto: CompanyDTO = {
      name: userProfileDto.companyName,
      catchPhrase: userProfileDto.catchPhrase,
      bs: userProfileDto.bs,
    };
    const addressDto: AddressDTO = {
      street: userProfileDto.street,
      suite: userProfileDto.suite,
      city: userProfileDto.city,
      zipcode: userProfileDto.zipcode,
    };
    let geo: Geo = await this.geoRepository.get(geoDto);
    let company: Company = await this.companyRepository.get(companyDto);
    let address: Address = await this.addressRepository.get(addressDto);
    if (!geo) geo = await this.geoRepository.add(geo);
    if (!company) company = await this.companyRepository.add(company);
    if (!address) address = await this.addressRepository.add(address);

    user.address = address;
    user.company = company;
    user.address.geo = geo;
    user.website = userProfileDto.website;
    user.phone = userProfileDto.phone;

    const updatedUser = this.userRepository.save(user);
    return updatedUser;
  }
}
