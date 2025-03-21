import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Restaurant } from 'src/data/entities/restaurant.entity';
import { UserJwtPayload } from 'lib/types/user.types';
import { RoleType } from 'src/data/entities/role.entity';
import { PermissionEnum } from 'src/data/entities/permission.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(user: UserJwtPayload): Promise<Restaurant[]> {
    const canView = await this.usersService.hasPermission(
      user.sub,
      PermissionEnum.VIEW_RESTAURANTS,
    );
    if (!canView) {
      throw new UnauthorizedException(
        'You do not have permission to view restaurants.',
      );
    }

    if (user.roles.includes(RoleType.ADMIN)) {
      return this.restaurantRepository.find({ relations: ['country'] });
    } else {
      const fullUser = await this.usersService.findById(user.sub);
      if (
        !fullUser ||
        !fullUser.userCountries ||
        fullUser.userCountries.length === 0
      ) {
        throw new NotFoundException('User country not found.');
      }
      const userCountryName = fullUser.userCountries[0].country.name;
      return this.restaurantRepository.find({
        where: { country: { name: userCountryName } },
        relations: ['country'],
      });
    }
  }

  async findOne(id: string, user: UserJwtPayload): Promise<Restaurant> {
    const canView = await this.usersService.hasPermission(
      user.sub,
      PermissionEnum.VIEW_RESTAURANTS,
    );
    if (!canView) {
      throw new UnauthorizedException(
        'You do not have permission to view restaurants.',
      );
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['country', 'menuCategories', 'menuCategories.menuItems'],
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found.');
    }
    if (!user.roles.includes(RoleType.ADMIN)) {
      const fullUser = await this.usersService.findById(user.sub);
      if (
        !fullUser ||
        !fullUser.userCountries ||
        fullUser.userCountries.length === 0
      ) {
        throw new NotFoundException('User country not found.');
      }
      const userCountryName = fullUser.userCountries[0].country.name;
      if (restaurant.country.name !== userCountryName) {
        throw new NotFoundException('Restaurant not found in your country.');
      }
    }
    return restaurant;
  }
}
