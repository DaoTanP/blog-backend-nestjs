import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserRoleService } from '@modules/auth/services/user-role.service';
import { UserRoleRepository } from '@modules/auth/repositories/user-role.repository';
import { AddressRepository } from './repositories/address.repository';
import { GeoRepository } from './repositories/geo.repository';
import { CompanyRepository } from './repositories/company.repository';
import { RoleRepository } from '@modules/auth/repositories/role.repository';
import { PostService } from '@modules/post/post.service';
import { PostRepository } from '@modules/post/repositories/post.repository';
import { CommentService } from '@modules/comment/comment.service';
import { CommentRepository } from '@modules/comment/repositories/comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserRoleService,
    PostService,
    PostRepository,
    CommentService,
    CommentRepository,
    UserRoleRepository,
    RoleRepository,
    AddressRepository,
    GeoRepository,
    CompanyRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
