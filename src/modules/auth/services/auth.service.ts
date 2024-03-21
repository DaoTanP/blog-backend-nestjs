import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignInDTO } from '@modules/auth/dto/signIn.dto';
import { isEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@modules/user/user.service';
import { User } from '@modules/user/entities/user.entity';
import { UserRoleService } from './user-role.service';
import { UserRole } from '@/modules/auth/entities/user-role.entity';
import { SignUpDTO } from '../dto/signUp.dto';
import { UserRepository } from '@/modules/user/repositories/user.repository';
import { Messages } from '@/shared/constants/messages.constant';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
    private readonly userRepository: UserRepository,
  ) { }

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

    return this.userService.getByUsername(account.username);
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

  async signUp(signUpDTO: SignUpDTO) {
    try {

      const usernameExists = await this.userRepository.getAccountByUsername(signUpDTO.username);
      if (usernameExists) {
        throw new BadRequestException('Username is already taken');
      }
      const emailExists = await this.userRepository.getAccountByEmail(signUpDTO.email);
      if (emailExists) {
        throw new BadRequestException('Email is already taken');
      }
      const hashedPassword = await bcrypt.hash(signUpDTO.password, 10);

      const user = await this.userRepository.create({...signUpDTO, password: hashedPassword});
      await this.userRepository.save(user);

      return user;

    } catch (error) {
      throw error instanceof HttpException ? error : new InternalServerErrorException(Messages.INTERNAL_SERVER_ERROR);
    }
  }
}
