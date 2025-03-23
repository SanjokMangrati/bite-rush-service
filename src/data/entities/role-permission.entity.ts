import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'role_permissions' })
export class RolePermission {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @JoinColumn({ name: 'role_id' })
  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @JoinColumn({ name: 'permission_id' })
  @ManyToOne(() => Permission, { onDelete: 'CASCADE' })
  permission: Permission;
}
