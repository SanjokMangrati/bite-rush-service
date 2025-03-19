import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEnum } from 'class-validator';
import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';

export enum RoleType {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'enum', enum: RoleType, unique: true })
  @IsEnum(RoleType)
  name: RoleType;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
