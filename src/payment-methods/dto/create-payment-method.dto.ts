import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Matches,
} from 'class-validator';
import { PaymentType } from 'src/data/entities/payment-method.entity';

export class CreatePaymentMethodDto {
  @ApiProperty({
    example: PaymentType.CREDIT_CARD,
    enum: PaymentType,
    description: 'Type of payment method',
  })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    example: '4242424242424242',
    description: 'Credit/Debit card number',
  })
  @IsString()
  @IsNotEmpty()
  card_number: string;

  @ApiProperty({ example: 'Johnny Snow', description: 'Name on the card' })
  @IsString()
  @IsNotEmpty()
  cardholder_name: string;

  @ApiProperty({
    example: '12/25',
    description: 'Expiry date of the card (MM/YY)',
  })
  @IsString()
  @IsNotEmpty()
  expiry_date: string;

  @ApiProperty({
    example: '123',
    description: 'CVV of the card (3 digits only)',
  })
  @IsString()
  @Matches(/^\d{3}$/, { message: 'CVV must be exactly 3 digits' })
  cvv: string;

  @ApiProperty({
    example: false,
    description: 'Whether this card should be set as the default',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
