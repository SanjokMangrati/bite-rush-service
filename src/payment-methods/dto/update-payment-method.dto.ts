import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Matches,
} from 'class-validator';
import { PaymentType } from 'src/data/entities/payment-method.entity';

export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({
    example: PaymentType.DEBIT_CARD,
    enum: PaymentType,
    description: 'Type of payment method',
  })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiPropertyOptional({
    example: '4242424242424242',
    description: 'Credit/Debit card number',
  })
  @IsOptional()
  @IsString()
  card_number?: string;

  @ApiPropertyOptional({
    example: 'Johnny Snow',
    description: 'Name on the card',
  })
  @IsOptional()
  @IsString()
  cardholder_name?: string;

  @ApiPropertyOptional({
    example: '12/25',
    description: 'Expiry date of the card (MM/YY)',
  })
  @IsOptional()
  @IsString()
  expiry_date?: string;

  @ApiPropertyOptional({
    example: '123',
    description: 'CVV of the card (3 digits only)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{3}$/, { message: 'CVV must be exactly 3 digits' })
  cvv?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Set as default payment method',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
