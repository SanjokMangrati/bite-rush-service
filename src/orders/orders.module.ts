import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/data/entities/country.entity';
import { MenuItem } from 'src/data/entities/menu-item.entity';
import { OrderItem } from 'src/data/entities/order-item.entity';
import { Order } from 'src/data/entities/order.entity';
import { PaymentMethod } from 'src/data/entities/payment-method.entity';
import { Restaurant } from 'src/data/entities/restaurant.entity';
import { UsersModule } from 'src/users/users.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      MenuItem,
      PaymentMethod,
      Restaurant,
      Country,
    ]),
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
