import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsString } from 'class-validator';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { UserCountry } from './user-country.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
  @IsString()
  name: string;

  @OneToMany(() => UserCountry, (userCountry) => userCountry.country)
  userCountries: UserCountry[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.country)
  restaurants: Restaurant[];

  @OneToMany(() => Order, (order) => order.country)
  orders: Order[];
}
