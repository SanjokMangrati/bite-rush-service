import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEnum, IsNumber } from 'class-validator';
import { Country } from './country.entity';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from './payment-method.entity';
import { Restaurant } from './restaurant.entity';
import { User } from './user.entity';

export enum OrderStatus {
  CART = 'CART',
  PLACED = 'PLACED',
  PREPARING = 'PREPARING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @JoinColumn({ name: 'restaurant_id' })
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  total_amount: number;

  @JoinColumn({ name: 'payment_method_id' })
  @ManyToOne(() => PaymentMethod, { onDelete: 'SET NULL', nullable: true })
  paymentMethod: PaymentMethod;

  @JoinColumn({ name: 'country_id' })
  @ManyToOne(() => Country, (country) => country.orders, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
