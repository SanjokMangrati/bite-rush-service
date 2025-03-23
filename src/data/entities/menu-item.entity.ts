import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsBoolean, IsNumber, IsString, IsUrl } from 'class-validator';
import { MenuCategory } from './menu-categories.entity';

@Entity({ name: 'menu_items' })
export class MenuItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ManyToOne(() => MenuCategory, (category) => category.menuItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: MenuCategory;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  @IsString()
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  @IsString()
  description: string;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  price: number;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  @IsUrl()
  image_url: string;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  @IsBoolean()
  is_available: boolean;
}
