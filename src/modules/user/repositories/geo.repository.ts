import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Geo } from '@modules/user/entities/geo.entity';
import { GeoDTO } from '@modules/user/dto/geo.dto';

@Injectable()
export class GeoRepository extends Repository<Geo> {
  constructor(private dataSource: DataSource) {
    super(Geo, dataSource.createEntityManager());
  }

  async getAll(): Promise<Geo[]> {
    return this.find();
  }

  async getById(id: number): Promise<Geo> {
    return this.findOne({
      where: { id },
    });
  }

  async getByLatitude(latitude: string): Promise<Geo> {
    return this.findOne({
      where: { lat: latitude },
    });
  }

  async getByLongitude(longitude: string): Promise<Geo> {
    return this.findOne({
      where: { lng: longitude },
    });
  }

  async getByCoordinate(latitude: string, longitude: string): Promise<Geo> {
    return this.findOne({
      where: { lat: latitude, lng: longitude },
    });
  }

  async get(geoDto: GeoDTO): Promise<Geo> {
    return this.findOne({
      where: geoDto,
    });
  }

  async add(geoDto: GeoDTO): Promise<Geo> {
    const geo: Geo = this.create(geoDto);
    return this.save(geo);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
