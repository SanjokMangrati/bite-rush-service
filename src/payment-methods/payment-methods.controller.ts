import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';
import { PaymentMethod } from 'src/data/entities/payment-method.entity';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: 'List all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'List of payment methods',
    type: [PaymentMethod],
  })
  async list(@Req() req: Request): Promise<PaymentMethod[]> {
    return this.paymentMethodsService.listUserPaymentMethods(req['user'].sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({
    status: 201,
    description: 'Payment method created',
    type: PaymentMethod,
  })
  async create(
    @Body() createDto: CreatePaymentMethodDto,
    @Req() req: Request,
  ): Promise<PaymentMethod> {
    return this.paymentMethodsService.createPaymentMethod(
      createDto,
      req['user'],
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment method' })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated',
    type: PaymentMethod,
  })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentMethodDto,
    @Req() req: Request,
  ): Promise<PaymentMethod> {
    return this.paymentMethodsService.updatePaymentMethod(
      id,
      updateDto,
      req['user'],
    );
  }
}
