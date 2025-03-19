import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEnum, IsString } from 'class-validator';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';
import { UserCountry } from './user-country.entity';

export enum CountryType {
  GLOBAL = 'GLOBAL',
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
}
@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'enum', enum: CountryType, unique: true })
  @IsEnum(CountryType)
  name: CountryType;

  @OneToMany(() => UserCountry, (userCountry) => userCountry.country)
  userCountries: UserCountry[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.country)
  restaurants: Restaurant[];

  @OneToMany(() => Order, (order) => order.country)
  orders: Order[];
}
