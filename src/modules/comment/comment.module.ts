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
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { AddressRepository } from '@modules/user/repositories/address.repository';
import { CompanyRepository } from '@modules/user/repositories/company.repository';
import { GeoRepository } from '@modules/user/repositories/geo.repository';
import { UserRoleService } from '@modules/auth/services/user-role.service';
import { UserRoleRepository } from '@modules/auth/repositories/user-role.repository';
import { RoleRepository } from '@modules/auth/repositories/role.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentController],
  providers: [
    CommentService,
    CommentRepository,
    PostService,
    PostRepository,
    UserService,
    UserRepository,
    AddressRepository,
    CompanyRepository,
    GeoRepository,
    UserRoleService,
    UserRoleRepository,
    RoleRepository,
  ],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
