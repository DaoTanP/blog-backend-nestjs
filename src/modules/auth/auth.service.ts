import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from './dto/signIn.dto';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(signInDTO: SignInDTO) {
    const byEmail = isEmail(signInDTO.usernameOrEmail);

    const account = await (byEmail
      ? this.userService.getAccountByEmail(signInDTO.usernameOrEmail)
      : this.userService.getAccountByUsername(signInDTO.usernameOrEmail));

    if (
      !account ||
      !(await bcrypt.compare(signInDTO.password, account.password))
    )
      return null;

    return this.userService.getById(account.id);
  }

  generateToken(user: any) {
    return {
      access_token: this.jwtService.sign({
        id: user.id,
        name: user.username,
      }),
    };
  }
}
