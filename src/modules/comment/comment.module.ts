import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { PostService } from '@modules/post/post.service';
import { PostRepository } from '@modules/post/repositories/post.repository';
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { RoleRepository } from '@modules/auth/repositories/role.repository';
import { AuthService } from '@modules/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    PostService,
    PostRepository,
    UserService,
    UserRepository,
    RoleRepository,
    AuthService,
    JwtService,
  ],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
