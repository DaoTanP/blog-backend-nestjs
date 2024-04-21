import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { PostRepository } from './repositories/post.repository';
import { Tag } from './entities/tag.entity';
import { CommentModule } from '@modules/comment/comment.module';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '@modules/auth/services/auth.service';
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/repositories/user.repository';

@Module({
  imports: [CommentModule, TypeOrmModule.forFeature([Post, Tag])],
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    UserService,
    UserRepository,
    AuthService,
    JwtService,
  ],
})
export class PostModule {}
