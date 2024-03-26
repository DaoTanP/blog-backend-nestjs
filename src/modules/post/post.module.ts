import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post } from './entities/post.entity';
import { User } from '@modules/user/entities/user.entity';
import { PostRepository } from './repositories/post.repository';
import { UserModule } from '@modules/user/user.module';
import { Tag } from './entities/tag.entity';
import { PostTag } from './entities/post-tag.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Post, Tag, PostTag, User])],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
