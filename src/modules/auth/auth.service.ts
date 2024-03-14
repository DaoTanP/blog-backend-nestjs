import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { UserRoleRepository } from './userRole.repository';
import { SignInDTO } from './dto/signIn.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository,
  ) {}

  async signIn(signInDTO: SignInDTO) {
    const email = isEmail(signInDTO.usernameOrEmail);
    return email;
  }
}
