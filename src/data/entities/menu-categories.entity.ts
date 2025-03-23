import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
import { MenuItem } from './menu-item.entity';
import { Restaurant } from './restaurant.entity';

@Entity({ name: 'menu_categories' })
export class MenuCategory {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menuCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @IsString()
  description: string;

  @OneToMany(() => MenuItem, (menuItem) => menuItem.category)
  menuItems: MenuItem[];
}
