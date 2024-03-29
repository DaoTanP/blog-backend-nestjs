import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { UserModule } from '@modules/user/user.module';
import { PhotoRepository } from './repositories/photo.repository';
import { Photo } from './entities/photo.entity';
import { User } from '@modules/user/entities/user.entity';
import { Album } from '@modules/album/entities/album.entity';
import { AlbumService } from '@modules/album/album.service';
import { AlbumRepository } from '@modules/album/repositories/album.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Photo, User, Album])],
  controllers: [PhotoController],
  providers: [PhotoService, PhotoRepository, AlbumService, AlbumRepository],
})
export class PhotoModule {}
