import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '@modules/user/user.service';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';
import { Comment } from '@modules/comment/entities/comment.entity';
import { PostService } from '@modules/post/post.service';
import { CommentService } from '@modules/comment/comment.service';
import { Messages } from '@shared/constants/messages.constant';
import { OwnerDecoratorParams } from '../decorators/owner.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private postService: PostService,
    private commentService: CommentService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownerMetadata: string | OwnerDecoratorParams = this.reflector.get<
      string | OwnerDecoratorParams
    >('owner', context.getHandler());
    const request: Request = context.switchToHttp().getRequest<Request>();

    if (!ownerMetadata) return true;

    // assuming request.user is returned from the custom authentication guard
    if (request?.user) {
      const { id } = request.user as User;
      const user: User = await this.userService.getById(id);
      const requestParams = request.params;
      const requestBody = request.body;
      if (typeof ownerMetadata === 'string')
        return this.userService.hasPermission(
          requestParams[ownerMetadata],
          user,
        );

      switch (ownerMetadata.type) {
        case User:
          if (ownerMetadata.idParamName)
            return this.userService.hasPermission(
              requestParams[ownerMetadata.idParamName as string],
              user,
              ownerMetadata.skipCheckRoles,
            );

          if (ownerMetadata.requestType === 'body')
            return this.userService.hasPermission(
              requestBody[ownerMetadata.idParamName as string],
              user,
              ownerMetadata.skipCheckRoles,
            );

        case Post:
          const post: Post = await this.postService.getById(
            parseInt(requestParams[ownerMetadata.idParamName as string], 10),
          );
          if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);
          return this.userService.hasPermission(
            post.user.username,
            user,
            ownerMetadata.skipCheckRoles,
          );

        case Comment:
          const comment: Comment = await this.commentService.getById(
            parseInt(
              requestParams[ownerMetadata.idParamName['selfIdParam']],
              10,
            ),
            parseInt(
              requestParams[ownerMetadata.idParamName['parentIdParam']],
              10,
            ),
          );
          if (!comment) throw new NotFoundException(Messages.COMMENT_NOT_FOUND);
          return this.userService.hasPermission(
            comment.user.username,
            user,
            ownerMetadata.skipCheckRoles,
          );

        default:
          return false;
      }
    }

    return false;
  }
}
