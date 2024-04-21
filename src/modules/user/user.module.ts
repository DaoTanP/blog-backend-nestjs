import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from '@modules/auth/repositories/role.repository';
import { PostService } from '@modules/post/post.service';
import { PostRepository } from '@modules/post/repositories/post.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@modules/auth/services/auth.service';
import { CommentService } from '@modules/comment/comment.service';
import { CommentRepository } from '@modules/comment/repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    JwtService,
    UserService,
    UserRepository,
    PostService,
    PostRepository,
    RoleRepository,
    AuthService,
    CommentService,
    CommentRepository,
  ],
})
export class UserModule {}
