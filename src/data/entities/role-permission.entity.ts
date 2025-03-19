import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  permission: Permission;
}
