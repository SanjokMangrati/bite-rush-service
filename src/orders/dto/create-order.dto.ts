import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'restaurant-uuid',
    description: 'Restaurant ID for which the order is created',
  })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
