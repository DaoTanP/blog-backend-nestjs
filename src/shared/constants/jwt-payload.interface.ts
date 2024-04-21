import { RoleEnum } from './role.enum';

export interface JwtPayload {
  id: string;
  username: string;
  roles: RoleEnum[];
}
