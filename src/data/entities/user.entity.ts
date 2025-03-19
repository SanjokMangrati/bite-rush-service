import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { IsEmail, IsString } from 'class-validator';
import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';
import { UserCountry } from './user-country.entity';
import { UserRole } from './user-role.entity';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255 })
  @IsString()
  password: string; // Hashed

  @Column({ name: 'name', type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  paymentMethods: PaymentMethod[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => UserCountry, (userCountry) => userCountry.user)
  userCountries: UserCountry[];
}
