import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/shared/config/jwt.config';
import { LocalStrategy } from '@shared/guards/local.strategy';
import { JwtStrategy } from '@/shared/guards/jwt.strategy';
import { RoleRepository } from './repositories/role.repository';
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/repositories/user.repository';
import { RefreshTokenStrategy } from '@/shared/guards/refresh-token.strategy';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RefreshToken } from './entities/refresh-token.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([Role, RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    RoleRepository,
    UserService,
    UserRepository,
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
