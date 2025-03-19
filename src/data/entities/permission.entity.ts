import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEnum, IsUUID } from 'class-validator';

export enum PermissionEnum {
  VIEW_RESTAURANTS = 'VIEW_RESTAURANTS',
  CREATE_ORDER = 'CREATE_ORDER',
  PLACE_ORDER = 'PLACE_ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  UPDATE_PAYMENT = 'UPDATE_PAYMENT',
}

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  @IsUUID()
  id: string;

  @Column({ name: 'name', type: 'enum', enum: PermissionEnum, unique: true })
  @IsEnum(PermissionEnum)
  name: PermissionEnum;
}
