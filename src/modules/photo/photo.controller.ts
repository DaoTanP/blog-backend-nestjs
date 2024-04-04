import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '@modules/user/user.service';
import { PhotoService } from './photo.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Messages } from '@shared/constants/messages.constant';
import { User } from '@modules/user/entities/user.entity';
import { Photo } from './entities/photo.entity';
import { AlbumService } from '@modules/album/album.service';
import { Album } from '@modules/album/entities/album.entity';
import { PhotoDto } from './dto/photo.dto';

@Controller('api/v1/photos')
export class PhotoController {
  constructor(
    private readonly photoService: PhotoService,
    private readonly albumService: AlbumService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllPhoto(): Promise<Photo[] | unknown> {
    return this.photoService.getAllPhoto();
  }

  @Get(':id')
  async getPhotoById(@Param('id') id: number): Promise<Photo | unknown> {
    const photo: Photo = await this.photoService.getPhoto(id);

    if (!photo)
      throw new NotFoundException({
        message: Messages.PHOTO_NOT_FOUND,
      });
    return photo;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPhoto(
    @Req() req: Request,
    @Body() formData: PhotoDto,
  ): Promise<Photo | unknown> {
    const album: Album = await this.albumService.getById(formData.albumId);
    if (!album) throw new NotFoundException(Messages.ALBUM_NOT_FOUND);

    return this.photoService.addPhoto(formData, req.user as User, album);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePhoto(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() formData: PhotoDto,
  ): Promise<Photo | unknown> {
    const album: Album = await this.albumService.getById(formData.albumId);
    if (!album) throw new NotFoundException(Messages.ALBUM_NOT_FOUND);

    const updatePhoto: Photo = await this.photoService.getById(
      id,
      formData.albumId,
    );
    if (!updatePhoto) throw new NotFoundException(Messages.PHOTO_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        updatePhoto.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.photoService.updateById(id, formData.albumId, formData);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePhoto(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<boolean | unknown> {
    const deletePhoto: Photo = await this.photoService.getPhoto(id);
    if (!deletePhoto) throw new NotFoundException(Messages.PHOTO_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        deletePhoto.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.photoService.deleteById(id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
