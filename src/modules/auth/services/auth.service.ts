import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from '@/modules/auth/dto/sign-in.dto';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { User } from '@modules/user/entities/user.entity';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { Role } from '@modules/auth/entities/role.entity';
import { RoleEnum } from '@/shared/constants/role.enum';
import { JwtPayload } from '@/shared/constants/jwt-payload.interface';
import { TokenDTO } from '@modules/auth/dto/token.dto';
import { RefreshTokenRepository } from '@modules/auth/repositories/refresh-token.repository';
import { RefreshToken } from '@modules/auth/entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async validateUser(signInDTO: SignInDTO): Promise<User | null> {
    const byEmail: boolean = isEmail(signInDTO.usernameOrEmail);

    const account: User = await (byEmail
      ? this.userService.getAccountByEmail(signInDTO.usernameOrEmail)
      : this.userService.getAccountByUsername(signInDTO.usernameOrEmail));

    if (
      !account ||
      !(await bcrypt.compare(signInDTO.password, account.password))
    )
      return null;

    return this.userService.getById(account.id);
  }

  generateToken(user: User = null): TokenDTO {
    if (!user)
      return {
        accessToken: this.jwtService.sign({}),
        refreshToken: this.jwtService.sign({}, { expiresIn: '7d' }),
      };

    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((role: Role) => role.name),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        { username: user.username },
        { expiresIn: '7d' },
      ),
    };
  }

  async getRefreshToken(user: User): Promise<string> {
    const refreshToken: RefreshToken =
      await this.refreshTokenRepository.getByUserId(user.id);

    return refreshToken.token;
  }

  validateRefreshToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.getByToken(token);
  }

  async updateRefreshToken(token: string, user: User): Promise<string> {
    const refreshToken: RefreshToken =
      await this.refreshTokenRepository.updateToken(token, user);

    return refreshToken.token;
  }

  async signUp(signUpDTO: SignUpDTO): Promise<TokenDTO> {
    const user: User = await this.userService.addUser(signUpDTO);
    const token: TokenDTO = this.generateToken(user);
    await this.refreshTokenRepository.addToken(token.refreshToken, user);

    return token;
  }

  hasPermission(
    username: string,
    user: User,
    skipCheckRoles: RoleEnum[] = [RoleEnum.ADMIN],
  ): boolean {
    if (
      user.username !== username &&
      !skipCheckRoles.some((roleToSkip: RoleEnum) =>
        user.roles.map((userRole: Role) => userRole.name).includes(roleToSkip),
      )
    )
      return false;

    return true;
  }
}
