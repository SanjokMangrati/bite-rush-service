import { Country } from './country.entity';
import { MenuCategory } from './menu-categories.entity';
import { MenuItem } from './menu-item.entity';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';
import { Restaurant } from './restaurant.entity';
import { Role } from './role.entity';
import { UserCountry } from './user-country.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';

export const entities = [
  Country,
  MenuCategory,
  MenuItem,
  OrderItem,
  Order,
  PaymentMethod,
  Restaurant,
  Role,
  UserCountry,
  UserRole,
  User,
  Permission,
  RolePermission,
];
