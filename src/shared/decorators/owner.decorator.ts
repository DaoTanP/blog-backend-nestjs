import { SetMetadata, Type } from '@nestjs/common';
import { UserRoles } from '../constants/role.enum';

export interface OwnerDecoratorParams {
  idParamName: string | { selfIdParam: string; parentIdParam: string };
  type?: Type;
  skipCheckRoles?: UserRoles[];
  requestType?: 'params' | 'body';
}

// example: @Owner('username'), @Owner({type: Post, idParamName: 'postId', skipCheckRoles=[UserRoles.ADMIN] })
export const Owner = <T>(
  param:
    | string
    | {
        idParamName: string | { selfIdParam: string; parentIdParam: string };
        type?: Type<T>;
        skipCheckRoles?: UserRoles[];
        requestType?: 'params' | 'body';
      } = 'username',
) => SetMetadata('owner', param);
