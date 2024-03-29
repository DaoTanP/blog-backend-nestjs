import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsSelect,
  Repository,
} from 'typeorm';
import { Photo } from '@modules/photo/entities/photo.entity';
import { User } from '@modules/user/entities/user.entity';
import { Album } from '@modules/album/entities/album.entity';
import { PhotoDto } from '../dto/photo.dto';

@Injectable()
export class PhotoRepository extends Repository<Photo> {
  private findOptionRelations: FindOptionsRelations<Photo> = {
    user: true,
  };

  private findOptionsSelect: FindOptionsSelect<Photo> = {
    user: { username: true },
  };

  constructor(private dataSource: DataSource) {
    super(Photo, dataSource.createEntityManager());
  }

  async getByAlbumId(albumId: number): Promise<Photo[]> {
    return this.find({
      where: { album: { id: albumId } },
      select: this.findOptionsSelect,
      relations: this.findOptionRelations,
    });
  }

  async getPhoto(id: number): Promise<Photo> {
    return this.findOne({
      where: { id },
      relations: this.findOptionRelations,
    });
  }

  async getById(id: number, albumId: number): Promise<Photo> {
    return this.findOne({
      where: { id, album: { id: albumId } },
      select: this.findOptionsSelect,
      relations: this.findOptionRelations,
    });
  }

  async addPhoto(formData: PhotoDto, user: User, album: Album): Promise<Photo> {
    const photo: Photo = this.create({
      title: formData.title,
      url: formData.url,
      thumbnailUrl: formData.thumbnailUrl,
    });
    photo.user = user;
    photo.album = album;

    return this.save(photo);
  }

  async updateById(
    id: number,
    albumId: number,
    formData: PhotoDto,
  ): Promise<Photo> {
    const photo: Photo = await this.getById(id, albumId);
    photo.title = formData.title;
    photo.url = formData.url;
    photo.thumbnailUrl = formData.thumbnailUrl;

    return this.save(photo);
  }

  async deleteById(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.delete({
      id,
    });
    if (deleteResult.affected === 0) return false;

    return true;
  }
}
