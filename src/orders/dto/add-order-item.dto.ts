import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class AddOrderItemDto {
  @ApiProperty({
    example: 'menu-item-uuid',
    description: 'ID of the menu item to add',
  })
  @IsString()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2, description: 'Quantity of the menu item' })
  @IsNumber()
  @Min(1)
  quantity: number;
}
