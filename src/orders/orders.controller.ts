import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { OrderItem } from 'src/data/entities/order-item.entity';
import { Order } from 'src/data/entities/order.entity';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  //I have added this endpoint only for flexibility and cause I felt I should ;)
  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created', type: Order })
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto, req['user']);
  }

  //I have added this endpoint only for flexibility and cause I felt I should ;)
  @Post(':orderId/items')
  @ApiOperation({ summary: 'Add a menu item to an existing order' })
  @ApiResponse({
    status: 201,
    description: 'Order item added',
    type: OrderItem,
  })
  async addOrderItem(
    @Param('orderId') orderId: string,
    @Body() addOrderItemDto: AddOrderItemDto,
  ): Promise<OrderItem> {
    return this.ordersService.addOrderItem(orderId, addOrderItemDto);
  }

  @Post('items')
  @ApiOperation({
    summary:
      'Add a menu item to cart, this will auto create order if none exists',
  })
  @ApiResponse({
    status: 201,
    description: 'Order and order item created',
    type: Order,
  })
  async addItemToCart(
    @Body() addItemToCartDto: AddItemToCartDto,
    @Req() req: Request,
  ): Promise<Order> {
    return this.ordersService.addItemToCart(addItemToCartDto, req['user']);
  }

  @Post(':orderId/checkout')
  @ApiOperation({ summary: 'Checkout an order' })
  @ApiResponse({ status: 200, description: 'Order checked out', type: Order })
  async checkoutOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ): Promise<Order> {
    return this.ordersService.checkoutOrder(orderId, req['user']);
  }

  @Patch(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200, description: 'Order cancelled', type: Order })
  async cancelOrder(
    @Param('orderId') orderId: string,
    @Req() req: Request,
  ): Promise<Order> {
    return this.ordersService.cancelOrder(orderId, req['user']);
  }

  @Patch(':orderId/items/:menuItemId/decrease')
  @ApiOperation({ summary: 'Decrease quantity of an order item' })
  @ApiResponse({ status: 200, description: 'Order updated', type: Order })
  async decreaseOrderItem(
    @Param('orderId') orderId: string,
    @Param('menuItemId') menuItemId: string,
    @Body('decreaseBy') decreaseBy: number,
  ): Promise<Order | null> {
    return this.ordersService.decreaseOrderItem(
      orderId,
      menuItemId,
      decreaseBy,
    );
  }

  @Delete(':orderId/items/:menuItemId')
  @ApiOperation({ summary: 'Remove an order item completely' })
  @ApiResponse({ status: 200, description: 'Order updated', type: Order })
  async deleteOrderItem(
    @Param('orderId') orderId: string,
    @Param('menuItemId') menuItemId: string,
  ): Promise<Order | null> {
    return this.ordersService.deleteOrderItem(orderId, menuItemId);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get details of an order' })
  @ApiResponse({ status: 200, description: 'Order details', type: Order })
  async getOrder(@Param('orderId') orderId: string): Promise<Order> {
    return this.ordersService.getOrderById(orderId);
  }
}
