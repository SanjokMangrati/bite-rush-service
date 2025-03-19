import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { CountryType } from 'src/data/entities/country.entity';
import { RoleType } from 'src/data/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Johnny Sugar D', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'VeryStrongPassword123!',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: RoleType.ADMIN,
    enum: RoleType,
    description: 'User role',
  })
  @IsEnum(RoleType)
  role: RoleType;

  @ApiProperty({
    example: CountryType.GLOBAL,
    description: 'Country for the user. Set it GLOBAL for ADMIN',
  })
  @IsEnum(CountryType, {
    message: 'Country must be one of the allowed values.',
  })
  country: CountryType;
}
