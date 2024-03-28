import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { User } from '@modules/user/entities/user.entity';
import { UserRoleService } from '@modules/auth/services/user-role.service';
import { UserDTO } from '@modules/user/dto/user.dto';
import { UserRoles } from '@shared/constants/role.enum';
import { Address } from '@modules/user/entities/address.entity';
import { Company } from '@modules/user/entities/company.entity';
import { AddressRepository } from './address.repository';
import { CompanyRepository } from './company.repository';

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
    private readonly addressRepository: AddressRepository,
    private readonly companyRepository: CompanyRepository,
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

  async addUser(userDto: UserDTO): Promise<User> {
    const address: Address = await this.addressRepository.getOrAdd(
      userDto.address,
    );
    const company: Company = await this.companyRepository.getOrAdd(
      userDto.company,
    );

    userDto.address = address;
    userDto.company = company;
    const user: User = this.create(userDto);
    const newUser: User = await this.save(user);

    if (newUser) await this.userRoleService.add(newUser, UserRoles.USER);

    return newUser;
  }

  async updateById(id: number, userDto: UserDTO): Promise<boolean> {
    const address: Address = await this.addressRepository.getOrAdd(
      userDto.address,
    );
    const company: Company = await this.companyRepository.getOrAdd(
      userDto.company,
    );

    const user: User = await this.getById(id);
    const userToUpdate: User = Object.assign(user, userDto);
    userToUpdate.address = address;
    userToUpdate.company = company;
    const updatedUser: User = await this.save(userToUpdate);
    if (!updatedUser) return false;

    return true;
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
