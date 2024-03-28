import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './repositories/album.repository';
import { Album } from './entities/album.entity';
import { AlbumDto } from './dto/album.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async getAll(): Promise<Album[]> {
    return this.albumRepository.getAll();
  }

  async getById(id: number): Promise<Album> {
    return this.albumRepository.getById(id);
  }

  async addAlbum(albumDto: AlbumDto, user: User): Promise<Album> {
    return this.albumRepository.addAlbum(albumDto, user);
  }

  async updateById(id: number, albumDto: AlbumDto): Promise<Album> {
    return this.albumRepository.updateById(id, albumDto);
  }

  async deleteById(id: number): Promise<boolean> {
    return this.albumRepository.deleteById(id);
  }
}
