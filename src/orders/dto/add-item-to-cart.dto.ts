import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class AddItemToCartDto {
  @ApiProperty({
    example: 'restaurant-id',
    description: 'Restaurant ID for which the item is being added',
  })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({
    example: 'menu-item-id',
    description: 'ID of the menu item to add',
  })
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2, description: 'Quantity of the menu item to add' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
