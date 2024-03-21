import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@modules/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared/config/jwt.config';
import { LocalStrategy } from '@shared/guards/local.strategy';
import { JwtStrategy } from '@shared/guards/jwt.strategy';
import { UserRoleService } from './services/user-role.service';
import { UserRoleRepository } from './repositories/user-role.repository';
import { RoleRepository } from './repositories/role.repository';

@Module({
  imports: [UserModule, PassportModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserRoleService,
    UserRoleRepository,
    RoleRepository,
  ],
})
export class AuthModule {}
