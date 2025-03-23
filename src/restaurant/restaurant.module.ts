import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Country } from 'src/data/entities/country.entity';
import { Restaurant } from 'src/data/entities/restaurant.entity';
import { RestaurantsController } from './restaurant.controller';
import { RestaurantsService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Country]), UsersModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
