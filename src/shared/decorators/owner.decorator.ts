import { CustomDecorator, SetMetadata, Type } from '@nestjs/common';
import { RoleEnum } from '@shared/constants/role.enum';

export interface OwnerDecoratorParams {
  idParamName: string | { selfIdParam: string; parentIdParam: string };
  type?: Type;
  skipCheckRoles?: RoleEnum[];
  requestType?: 'params' | 'body';
}

// example: @Owner('username'), @Owner({type: Post, idParamName: 'postId', skipCheckRoles=[UserRoles.ADMIN] })
export const Owner = <T>(
  param:
    | string
    | {
        idParamName: string | { selfIdParam: string; parentIdParam: string };
        type?: Type<T>;
        skipCheckRoles?: RoleEnum[];
        requestType?: 'params' | 'body';
      } = 'username',
): CustomDecorator<string> => SetMetadata('owner', param);
