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
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '@modules/user/user.service';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Messages } from '@/shared/constants/messages.enum';
import { User } from '@modules/user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { PostService } from '@modules/post/post.service';
import { Post as PostEntity } from '@modules/post/entities/post.entity';
import { Owner } from '@/shared/decorators/owner.decorator';
import { PermissionGuard } from '@/shared/guards/permission.guard';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getAllComments(
    @Param('postId') postId: string,
  ): Promise<Comment[] | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    return this.commentService.getByPostId(postId);
  }

  @Get(':id')
  async getCommentById(
    @Param('postId') postId: string,
    @Param('id') id: string,
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
    @Param('postId') postId: string,
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
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner({
    idParamName: { selfIdParam: 'id', parentIdParam: 'postId' },
    type: Comment,
  })
  async updateComment(
    @Param('postId') postId: string,
    @Param('id') id: string,
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

    return this.commentService.updateById(id, postId, formData.body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @Owner({
    idParamName: { selfIdParam: 'id', parentIdParam: 'postId' },
    type: Comment,
  })
  async deleteComment(
    @Param('postId') postId: string,
    @Param('id') id: string,
  ): Promise<boolean | unknown> {
    const post: PostEntity = await this.postService.getById(postId);
    if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);

    const commentToDelete: Comment = await this.commentService.getById(
      id,
      postId,
    );
    if (!commentToDelete)
      throw new NotFoundException(Messages.COMMENT_NOT_FOUND);

    return this.commentService.deleteById(id, postId);
  }
}
