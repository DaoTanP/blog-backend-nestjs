import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from '@modules/auth/dto/signIn.dto';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { User } from '@modules/user/entities/user.entity';
import { UserRoleService } from './user-role.service';
import { UserRole } from '@modules/auth/entities/user-role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
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

  async generateToken(user: any): Promise<{ access_token: string }> {
    const userRole: UserRole = await this.userRoleService.getByUserId(user.id);
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        username: user.username,
        role: userRole.role.name,
      }),
    };
  }
}
