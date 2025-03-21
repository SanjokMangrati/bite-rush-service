import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuItem } from 'src/data/entities/menu-item.entity';
import { OrderItem } from 'src/data/entities/order-item.entity';
import { Order, OrderStatus } from 'src/data/entities/order.entity';
import { UsersService } from 'src/users/users.service';
import { Repository, EntityManager } from 'typeorm';
import { AddOrderItemDto } from './dto/add-order-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UserJwtPayload } from 'lib/types/user.types';
import { RoleType } from 'src/data/entities/role.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly usersService: UsersService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userPayload: UserJwtPayload,
  ): Promise<Order> {
    const user = await this.usersService.findById(userPayload.sub);
    if (!user || !user.userCountries || user.userCountries.length === 0) {
      throw new NotFoundException('User country not found');
    }
    const country = user.userCountries[0].country;

    const order = this.orderRepository.create({
      user: { id: userPayload.sub },
      restaurant: { id: createOrderDto.restaurantId },
      status: OrderStatus.CART,
      total_amount: 0,
      country: country,
    });
    return this.orderRepository.save(order);
  }

  async addOrderItem(
    orderId: string,
    addOrderItemDto: AddOrderItemDto,
  ): Promise<OrderItem> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.status !== OrderStatus.CART) {
      throw new BadRequestException(
        'Cannot modify order that is not in CART status',
      );
    }
    const menuItem = await this.menuItemRepository.findOne({
      where: { id: addOrderItemDto.menuItemId },
    });
    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    const priceAtOrder = Number(menuItem.price);
    const orderItem = this.orderItemRepository.create({
      order: { id: orderId },
      menuItem: { id: menuItem.id },
      quantity: addOrderItemDto.quantity,
      price_at_order: priceAtOrder,
    });
    order.total_amount =
      Number(order.total_amount) + priceAtOrder * addOrderItemDto.quantity;
    await this.orderRepository.save(order);

    return this.orderItemRepository.save(orderItem);
  }

  async addItemToCart(
    addItemToCartDto: AddItemToCartDto,
    userPayload: UserJwtPayload,
  ): Promise<{ order: Order; orderItem: OrderItem }> {
    let order = await this.orderRepository.findOne({
      where: {
        user: { id: userPayload.sub },
        restaurant: { id: addItemToCartDto.restaurantId },
        status: OrderStatus.CART,
      },
    });

    if (!order) {
      const createOrderDto: CreateOrderDto = {
        restaurantId: addItemToCartDto.restaurantId,
      };
      order = await this.createOrder(createOrderDto, userPayload);
    }

    const addOrderItemDto: AddOrderItemDto = {
      menuItemId: addItemToCartDto.menuItemId,
      quantity: addItemToCartDto.quantity,
    };

    const orderItem = await this.addOrderItem(order.id, addOrderItemDto);
    return { order, orderItem };
  }

  async checkoutOrder(
    orderId: string,
    userPayload: UserJwtPayload,
  ): Promise<Order> {
    if (
      !userPayload.roles.includes(RoleType.ADMIN) &&
      !userPayload.roles.includes(RoleType.MANAGER)
    ) {
      throw new UnauthorizedException(
        'You are not allowed to checkout orders.',
      );
    }
    return await this.orderRepository.manager.transaction(
      async (manager: EntityManager) => {
        const order = await manager.findOne(Order, { where: { id: orderId } });
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        if (order.status !== OrderStatus.CART) {
          throw new BadRequestException('Order cannot be checked out.');
        }
        order.status = OrderStatus.PLACED;
        return await manager.save(order);
      },
    );
  }

  async cancelOrder(
    orderId: string,
    userPayload: UserJwtPayload,
  ): Promise<Order> {
    if (
      !userPayload.roles.includes(RoleType.ADMIN) &&
      !userPayload.roles.includes(RoleType.MANAGER)
    ) {
      throw new UnauthorizedException('You are not allowed to cancel orders.');
    }
    return await this.orderRepository.manager.transaction(
      async (manager: EntityManager) => {
        const order = await manager.findOne(Order, { where: { id: orderId } });
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        if (
          order.status !== OrderStatus.CART &&
          order.status !== OrderStatus.PLACED
        ) {
          throw new BadRequestException('Order cannot be cancelled.');
        }
        order.status = OrderStatus.CANCELLED;
        return await manager.save(order);
      },
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.menuItem'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}
