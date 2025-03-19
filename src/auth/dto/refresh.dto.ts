import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'User ID associated with the refresh token' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'The refresh token provided during login' })
  @IsString()
  refreshToken: string;
}
