import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { User } from '@modules/user/entities/user.entity';
import { AlbumRepository } from './repositories/album.repository';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Album, User])],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
})
export class AlbumModule {}
