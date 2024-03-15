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

    const user = await (byEmail
      ? this.userService.getByEmail(signInDTO.usernameOrEmail)
      : this.userService.getByUsername(signInDTO.usernameOrEmail));

    if (!user || !(await bcrypt.compare(signInDTO.password, user.password)))
      return null;

    return user;
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
