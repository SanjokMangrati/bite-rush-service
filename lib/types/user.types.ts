import { RoleType } from 'src/data/entities/role.entity';

export type UserJwtPayload = {
  sub: string;
  email: string;
  roles: Array<RoleType>;
};
