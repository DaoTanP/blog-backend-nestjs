import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';
import { Comment } from '@modules/comment/entities/comment.entity';
import { PostService } from '@modules/post/post.service';
import { CommentService } from '@modules/comment/comment.service';
import { Messages } from '@/shared/constants/messages.enum';
import { OwnerDecoratorParams } from '@shared/decorators/owner.decorator';
import { AuthService } from '@/modules/auth/services/auth.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
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
      const user: User = request.user as User;
      const requestParams: any = request.params;
      const requestBody: any = request.body;
      if (typeof ownerMetadata === 'string')
        return this.authService.hasPermission(
          requestParams[ownerMetadata],
          user,
        );

      switch (ownerMetadata.type) {
        case User:
          if (ownerMetadata.idParamName)
            return this.authService.hasPermission(
              requestParams[ownerMetadata.idParamName as string],
              user,
              ownerMetadata.skipCheckRoles,
            );

          if (ownerMetadata.requestType === 'body')
            return this.authService.hasPermission(
              requestBody[ownerMetadata.idParamName as string],
              user,
              ownerMetadata.skipCheckRoles,
            );
          break;

        case Post: {
          const post: Post = await this.postService.getById(
            requestParams[ownerMetadata.idParamName as string],
          );
          if (!post) throw new NotFoundException(Messages.POST_NOT_FOUND);
          return this.authService.hasPermission(
            post.user.username,
            user,
            ownerMetadata.skipCheckRoles,
          );
        }

        case Comment: {
          const comment: Comment = await this.commentService.getById(
            requestParams[ownerMetadata.idParamName['selfIdParam']],
            requestParams[ownerMetadata.idParamName['parentIdParam']],
          );
          if (!comment) throw new NotFoundException(Messages.COMMENT_NOT_FOUND);
          return this.authService.hasPermission(
            comment.user.username,
            user,
            ownerMetadata.skipCheckRoles,
          );
        }

        default:
          return false;
      }
    }

    return false;
  }
}
