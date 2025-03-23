import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Johnny Lightning',
    description: 'Full name of the user',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
