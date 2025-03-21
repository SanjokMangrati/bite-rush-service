import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Restaurant } from 'src/data/entities/restaurant.entity';
import { RestaurantsService } from './restaurant.service';

@ApiTags('Restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get a list of restaurants',
  })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants',
    type: [Restaurant],
  })
  async findAll(@Req() req: Request): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(req['user']);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get details for a specific restaurant',
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant details',
    type: Restaurant,
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Restaurant> {
    return this.restaurantsService.findOne(id, req['user']);
  }
}
