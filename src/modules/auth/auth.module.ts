import { Module } from '@nestjs/common';
import { Role } from './role.entity';
import { UserRole } from './userRole.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RoleRepository } from './role.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole])],
  controllers: [AuthController],
  providers: [RoleRepository, AuthService],
})
export class AuthModule {}
