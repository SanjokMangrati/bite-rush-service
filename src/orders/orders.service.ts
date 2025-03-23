import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
import { PermissionEnum } from 'src/data/entities/permission.entity';

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
    const canCreateOrder = await this.usersService.hasPermission(
      userPayload.sub,
      PermissionEnum.CREATE_ORDER,
    );
    if (!canCreateOrder) {
      throw new UnauthorizedException(
        'User does not have permission to create orders.',
      );
    }

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

    let orderItem = await this.orderItemRepository.findOne({
      where: {
        order: { id: orderId },
        menuItem: { id: addOrderItemDto.menuItemId },
      },
    });

    if (orderItem) {
      orderItem.quantity += addOrderItemDto.quantity;
      order.total_amount =
        Number(order.total_amount) + priceAtOrder * addOrderItemDto.quantity;
      await this.orderRepository.save(order);
      return await this.orderItemRepository.save(orderItem);
    } else {
      orderItem = this.orderItemRepository.create({
        order: { id: orderId } as any,
        menuItem: { id: menuItem.id } as any,
        quantity: addOrderItemDto.quantity,
        price_at_order: priceAtOrder,
      });
      order.total_amount =
        Number(order.total_amount) + priceAtOrder * addOrderItemDto.quantity;
      await this.orderRepository.save(order);
      return await this.orderItemRepository.save(orderItem);
    }
  }

  async addItemToCart(
    addItemToCartDto: AddItemToCartDto,
    userPayload: UserJwtPayload,
  ): Promise<Order> {
    const canCreateOrder = await this.usersService.hasPermission(
      userPayload.sub,
      PermissionEnum.CREATE_ORDER,
    );
    if (!canCreateOrder) {
      throw new UnauthorizedException(
        'User does not have permission to create orders.',
      );
    }

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

    await this.addOrderItem(order.id, addOrderItemDto);
    return await this.getOrderById(order.id);
  }

  async checkoutOrder(
    orderId: string,
    userPayload: UserJwtPayload,
  ): Promise<Order> {
    const canPlaceOrder = await this.usersService.hasPermission(
      userPayload.sub,
      PermissionEnum.PLACE_ORDER,
    );
    if (!canPlaceOrder) {
      throw new UnauthorizedException(
        'User does not have permission to place orders.',
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
    const canCancel = await this.usersService.hasPermission(
      userPayload.sub,
      PermissionEnum.CANCEL_ORDER,
    );
    if (!canCancel) {
      throw new UnauthorizedException(
        'User does not have permission to cancel orders.',
      );
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
      relations: ['orderItems', 'orderItems.menuItem', 'restaurant'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async decreaseOrderItem(
    orderId: string,
    menuItemId: string,
    decreaseBy: number,
  ): Promise<Order | null> {
    return await this.orderRepository.manager.transaction(
      async (manager: EntityManager) => {
        const order = await manager.findOne(Order, {
          where: { id: orderId },
          relations: ['orderItems', 'orderItems.menuItem'],
        });
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        if (order.status !== OrderStatus.CART) {
          throw new BadRequestException(
            'Cannot modify order that is not in CART status',
          );
        }
        const orderItem = order.orderItems.find(
          (item) => item.menuItem.id === menuItemId,
        );
        if (!orderItem) {
          throw new NotFoundException('Order item not found');
        }
        const menuItem = await this.menuItemRepository.findOne({
          where: { id: menuItemId },
        });
        if (!menuItem) {
          throw new NotFoundException('Menu item not found');
        }
        const priceAtOrder = Number(menuItem.price);

        orderItem.quantity -= decreaseBy;
        if (orderItem.quantity <= 0) {
          await manager.remove(OrderItem, orderItem);
          order.total_amount =
            Number(order.total_amount) -
            priceAtOrder * (orderItem.quantity + decreaseBy);
        } else {
          await manager.save(orderItem);
          order.total_amount =
            Number(order.total_amount) - priceAtOrder * decreaseBy;
        }
        const remainingItems = await manager.find(OrderItem, {
          where: { order: { id: orderId } },
        });
        if (remainingItems.length === 0) {
          await manager.remove(Order, order);
          return null;
        }
        return await manager.save(order);
      },
    );
  }

  async deleteOrderItem(
    orderId: string,
    menuItemId: string,
  ): Promise<Order | null> {
    return await this.orderRepository.manager.transaction(
      async (manager: EntityManager) => {
        const order = await manager.findOne(Order, {
          where: { id: orderId },
          relations: ['orderItems', 'orderItems.menuItem'],
        });
        if (!order) {
          throw new NotFoundException('Order not found');
        }
        if (order.status !== OrderStatus.CART) {
          throw new BadRequestException(
            'Cannot modify order that is not in CART status',
          );
        }
        const orderItem = order.orderItems.find(
          (item) => item.menuItem.id === menuItemId,
        );
        if (!orderItem) {
          throw new NotFoundException('Order item not found');
        }
        const menuItem = await this.menuItemRepository.findOne({
          where: { id: menuItemId },
        });
        if (!menuItem) {
          throw new NotFoundException('Menu item not found');
        }
        const priceAtOrder = Number(menuItem.price);

        await manager.remove(OrderItem, orderItem);
        order.total_amount =
          Number(order.total_amount) - priceAtOrder * orderItem.quantity;

        const remainingItems = await manager.find(OrderItem, {
          where: { order: { id: orderId } },
        });
        if (remainingItems.length === 0) {
          await manager.remove(Order, order);
          return null;
        }
        return await manager.save(order);
      },
    );
  }
}
