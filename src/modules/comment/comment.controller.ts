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
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Messages } from '@shared/constants/messages.constant';
import { User } from '@modules/user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { PostService } from '@modules/post/post.service';
import { Post as PostEntity } from '@modules/post/entities/post.entity';

@Controller('api/v1/posts/:postId/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllComment(
    @Param('postId') postId: number,
  ): Promise<Comment[] | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.commentService.getByPostId(postId);
  }

  @Get(':id')
  async getCommentById(
    @Param('postId') postId: number,
    @Param('id') id: number,
  ): Promise<Comment | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    const comment: Comment = await this.commentService.getById(id, postId);

    if (comment) return comment;

    throw new NotFoundException({
      message: Messages.COMMENT_NOT_FOUND,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addComment(
    @Req() req: Request,
    @Param('postId') postId: number,
    @Body() formData: { body: string },
  ): Promise<Comment | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.commentService.addComment(
      formData.body,
      req.user as User,
      post,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Req() req: Request,
    @Param('postId') postId: number,
    @Param('id') id: number,
    @Body() formData: { body: string },
  ): Promise<Comment | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    const commentToUpdate: Comment = await this.commentService.getById(
      id,
      postId,
    );
    if (!commentToUpdate)
      throw new NotFoundException(Messages.COMMENT_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        commentToUpdate.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.commentService.updateById(id, postId, formData.body);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Req() req: Request,
    @Param('postId') postId: number,
    @Param('id') id: number,
  ): Promise<boolean | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    const commentToDelete: Comment = await this.commentService.getById(
      id,
      postId,
    );
    if (!commentToDelete)
      throw new NotFoundException(Messages.COMMENT_NOT_FOUND);

    if (
      !(await this.userService.hasPermission(
        commentToDelete.user.username,
        req.user as User,
      ))
    )
      throw new UnauthorizedException();

    try {
      return this.commentService.deleteById(id, postId);
    } catch (error) {
      throw new InternalServerErrorException({
        message: Messages.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
