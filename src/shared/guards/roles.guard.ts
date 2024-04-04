import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleService } from '@modules/auth/services/user-role.service';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRoleService: UserRoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();

    if (!roles) return true;

    // assuming request.user is returned from the custom authentication guard
    if (request?.user) {
      const { id } = request.user as User;
      const userRole = await this.userRoleService.getByUserId(id);
      return roles.includes(userRole.role.name);
    }

    return false;
  }
}
