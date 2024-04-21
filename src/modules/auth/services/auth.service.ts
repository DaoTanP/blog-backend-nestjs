import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from '@/modules/auth/dto/sign-in.dto';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { User } from '@modules/user/entities/user.entity';
import { SignUpDTO } from '@modules/auth/dto/sign-up.dto';
import { Role } from '@modules/auth/entities/role.entity';
import { Messages } from '@/shared/constants/messages.enum';
import { RoleEnum } from '@/shared/constants/role.enum';
import { JwtPayload } from '@/shared/constants/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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

  generateToken(user: User): { access_token: string } {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      roles: user.roles.map((role: Role) => role.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<User | Error> {
    const usernameExists: boolean = await this.userService.isUsernameAvailable(
      signUpDTO.username,
    );
    if (usernameExists) {
      throw new Error(Messages.USERNAME_EXIST);
    }

    const emailExists: boolean = await this.userService.isEmailAvailable(
      signUpDTO.email,
    );
    if (emailExists) {
      throw new Error(Messages.EMAIL_EXIST);
    }

    return this.userService.addUser(signUpDTO);
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
