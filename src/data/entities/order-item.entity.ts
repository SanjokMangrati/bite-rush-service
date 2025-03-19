import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNumber } from 'class-validator';
import { MenuItem } from './menu-item.entity';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => MenuItem, { onDelete: 'CASCADE' })
  menuItem: MenuItem;

  @Column({ name: 'quantity', type: 'int' })
  @IsNumber()
  quantity: number;

  @Column({ name: 'price_at_order', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  price_at_order: number;
}
