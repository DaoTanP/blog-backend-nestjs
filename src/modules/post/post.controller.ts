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
import { CreatePostDTO } from './dto/create-post.dto';
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
  getAllPosts(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<PostEntity[]> {
    return this.postService.getAll(skip, take);
    //   .then((posts: PostEntity[]) =>
    //   posts.map((post: PostEntity) => {
    //     return {
    //       ...post,
    //       tags: post.tags.map((tag: Tag) => {
    //         return tag.name;
    //       }),
    //     };
    //   }),
    // );
  }

  @Get('search')
  searchPost(
    @Query('query') query: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<PostEntity[]> {
    return this.postService.searchPost(query, skip, take);
  }

  @Get('/user/:username')
  getAllPostsByUsername(
    @Param('username') username: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ): Promise<PostEntity[]> {
    return this.postService.getAllByUsername(username, skip, take);
    //   .then((posts: PostEntity[]) =>
    //   posts.map((post: PostEntity) => {
    //     return {
    //       ...post,
    //       tags: post.tags.map((tag: Tag) => {
    //         return tag.name;
    //       }),
    //     };
    //   }),
    // );
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostEntity> {
    const post: PostEntity = await this.postService.getById(id);

    if (post)
      // return {
      //   ...post,
      //   tags: post.tags.map((tag: Tag) => {
      //     return tag.name;
      //   }),
      // };
      return post;

    throw new NotFoundException({
      message: Messages.POST_NOT_FOUND,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  addPost(
    @Req() req: Request,
    @Body() formData: CreatePostDTO,
  ): Promise<PostEntity> {
    return this.postService.addPost(formData, req.user as User);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Owner({ idParamName: 'id', type: PostEntity })
  async updatePost(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() formData: CreatePostDTO,
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

  @Get('tags')
  getAllTags(): Promise<Tag[]> {
    return this.postService.getAllTags();
  }

  @Get('tags/filter')
  findTag(@Query('name') name: string): Promise<Tag[]> {
    return this.postService.findTag(name);
  }
}
