import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { Address } from '@modules/user/entities/address.entity';
import { AddressDTO } from '@modules/user/dto/address.dto';
import { GeoRepository } from './geo.repository';
import { Geo } from '@modules/user/entities/geo.entity';

@Injectable()
export class AddressRepository extends Repository<Address> {
  private findOptionRelations: FindOptionsRelations<Address> = {
    geo: true,
  };

  constructor(
    private dataSource: DataSource,
    private readonly geoRepository: GeoRepository,
  ) {
    super(Address, dataSource.createEntityManager());
  }

  async getAll(): Promise<Address[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  async getById(id: number): Promise<Address> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async get(addressDto: AddressDTO): Promise<Address> {
    return this.findOne({
      where: addressDto,
      relations: this.findOptionRelations,
    });
  }

  async getWithoutGeo(addressDto: AddressDTO): Promise<Address> {
    const { geo, ...searchFields } = addressDto;
    return this.findOne({
      where: searchFields,
      relations: this.findOptionRelations,
    });
  }

  async add(addressDto: AddressDTO): Promise<Address> {
    let geo: Geo = await this.geoRepository.get(addressDto.geo);
    if (!geo) geo = await this.geoRepository.add(addressDto.geo);

    const address: Address = this.create(addressDto);
    address.geo = geo;
    console.log(address);

    return this.save(address);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
