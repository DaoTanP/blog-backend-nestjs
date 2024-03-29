import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './shared/config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { TodoModule } from './modules/todo/todo.module';
import { AlbumModule } from './modules/album/album.module';
import { PhotoModule } from './modules/photo/photo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    AuthModule,
    UserModule,
    PostModule,
    CommentModule,
    TodoModule,
    AlbumModule,
    PhotoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
