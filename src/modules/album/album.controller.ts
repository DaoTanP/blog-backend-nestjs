import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  NotFoundException,
  Param,
  Body,
  Req,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './entities/album.entity';
import { Messages } from '@shared/constants/messages.constant';
import { AlbumDto } from './dto/album.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { User } from '@modules/user/entities/user.entity';
import { Request } from 'express';
import { UserService } from '@modules/user/user.service';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@Controller('api/v1/albums')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllPost(): Promise<Album[]> {
    return this.albumService.getAll();
  }

  @Get(':id')
  async getPostById(@Param('id') id: number): Promise<Album | unknown> {
    const album: Album = await this.albumService.getById(id);

    if (!album)
      throw new NotFoundException({
        message: Messages.ALBUM_NOT_FOUND,
      });
    return album;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addPost(
    @Req() req: Request,
    @Body() formData: AlbumDto,
  ): Promise<Album> {
    const album: Album = await this.albumService.getById(formData.userId);
    if (!album) throw new NotFoundException(Messages.ALBUM_NOT_FOUND);

    return await this.albumService.addAlbum(formData, req.user as User);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateAlbum(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() formData: AlbumDto,
  ): Promise<Album | unknown> {
    const updateAlbum: Album = await this.albumService.getById(id);
    if (!updateAlbum) throw new NotFoundException(Messages.ALBUM_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        updateAlbum.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.albumService.updateById(id, formData);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAlbum(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<boolean | unknown> {
    const postToDelete: Album = await this.albumService.getById(id);
    if (!postToDelete) throw new NotFoundException(Messages.ALBUM_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        postToDelete.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.albumService.deleteById(id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
