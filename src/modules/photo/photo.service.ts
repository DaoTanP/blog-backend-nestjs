import { Injectable } from '@nestjs/common';
import { PhotoRepository } from './repositories/photo.repository';
import { Photo } from './entities/photo.entity';
import { User } from '@modules/user/entities/user.entity';
import { Album } from '@modules/album/entities/album.entity';
import { PhotoDto } from './dto/photo.dto';

@Injectable()
export class PhotoService {
  constructor(private readonly photoRepository: PhotoRepository) {}

  async getAllPhoto(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  async getByAlbumId(albumId: number): Promise<Photo[]> {
    return this.photoRepository.getByAlbumId(albumId);
  }

  async getPhoto(id: number): Promise<Photo> {
    return this.photoRepository.getPhoto(id);
  }

  async getById(id: number, albumId: number): Promise<Photo> {
    return this.photoRepository.getById(id, albumId);
  }

  async addPhoto(formData: PhotoDto, user: User, album: Album): Promise<Photo> {
    return this.photoRepository.addPhoto(formData, user, album);
  }

  async updateById(
    id: number,
    albumId: number,
    formData: PhotoDto,
  ): Promise<Photo> {
    return this.photoRepository.updateById(id, albumId, formData);
  }

  async deleteById(id: number): Promise<boolean> {
    return this.photoRepository.deleteById(id);
  }
}
