import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './entities/post.entity';
import { Messages } from '@/shared/constants/messages.enum';
import { PostDTO } from './dto/post.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { User } from '@modules/user/entities/user.entity';
import { Request } from 'express';
import { UserService } from '@modules/user/user.service';
import { PermissionGuard } from '@/shared/guards/permission.guard';
import { Owner } from '@/shared/decorators/owner.decorator';
import { Tag } from './entities/tag.entity';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  getAllPost(): Promise<PostEntity[]> {
    return this.postService.getAll();
  }

  @Get('tags')
  getAllTags(): Promise<Tag[]> {
    return this.postService.getAllTags();
  }

  @Get('tags/filter')
  findTag(@Query('name') name: string): Promise<Tag[]> {
    return this.postService.findTag(name);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    const post: PostEntity = await this.postService.getById(id);

    if (post) return post;

    throw new NotFoundException({
      message: Messages.POST_NOT_FOUND,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addPost(@Req() req: Request, @Body() formData: PostDTO): Promise<PostEntity> {
    return this.postService.addPost(formData, req.user as User);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Owner({ idParamName: 'id', type: PostEntity })
  async updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() formData: PostDTO,
  ): Promise<PostEntity> {
    const postToUpdate: PostEntity = await this.postService.getById(id);
    if (!postToUpdate) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.postService.updateById(id, formData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner({ idParamName: 'id', type: PostEntity })
  async deletePost(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<boolean> {
    const postToDelete: PostEntity = await this.postService.getById(id);
    if (!postToDelete) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.postService.deleteById(id);
  }
}
