import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsUrl } from 'class-validator';
import { Country } from './country.entity';
import { MenuCategory } from './menu-categories.entity';
import { Order } from './order.entity';

@Entity({ name: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @IsString()
  description: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  image_url: string;

  @Column({ name: 'address', type: 'varchar', length: 500 })
  @IsString()
  address: string;

  @ManyToOne(() => Country, (country) => country.restaurants, {
    onDelete: 'CASCADE',
  })
  country: Country;

  @OneToMany(() => MenuCategory, (menuCategory) => menuCategory.restaurant)
  menuCategories: MenuCategory[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
