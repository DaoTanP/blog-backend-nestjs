import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  Repository,
} from 'typeorm';
import { Album } from '@modules/album/entities/album.entity';
import { AlbumDto } from '@modules/album/dto/album.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class AlbumRepository extends Repository<Album> {
  private findOptionRelations: FindOptionsRelations<Album> = {
    user: true,
  };

  constructor(private dataSource: DataSource) {
    super(Album, dataSource.createEntityManager());
  }

  async getAll(): Promise<Album[]> {
    return this.find({ relations: this.findOptionRelations });
  }

  async getById(id: number): Promise<Album> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async addAlbum(albumDto: AlbumDto, user: User): Promise<Album> {
    const album: Album = this.create(albumDto);
    album.user = user;

    return this.save(album);
  }

  async updateById(id: number, albumDto: AlbumDto): Promise<Album> {
    const album: Album = await this.getById(id);
    const updateAlbum: Album = Object.assign(album, albumDto);

    return this.save(updateAlbum);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({ id });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
