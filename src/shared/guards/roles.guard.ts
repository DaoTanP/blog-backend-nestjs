import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@modules/user/entities/user.entity';
import { Request } from 'express';
import { Role } from '@/modules/auth/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest<Request>();

    if (!roles) return true;

    // assuming request.user is returned from the custom authentication guard
    if (request?.user) {
      const user: User = request.user as User;
      return roles.some((role: string) =>
        user.roles
          .map((userRole: Role) => userRole.name.toString())
          .includes(role),
      );
    }

    return false;
  }
}
