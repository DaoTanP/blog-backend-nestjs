import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserModule } from '@modules/user/user.module';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { User } from '@modules/user/entities/user.entity';
import { Post } from '@modules/post/entities/post.entity';
import { PostService } from '@modules/post/post.service';
import { PostRepository } from '@modules/post/repositories/post.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, PostService, PostRepository],
})
export class CommentModule {}
