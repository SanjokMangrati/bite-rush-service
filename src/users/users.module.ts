import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/data/entities/user.entity';
import { Role } from 'src/data/entities/role.entity';
import { UserRole } from 'src/data/entities/user-role.entity';
import { Country } from 'src/data/entities/country.entity';
import { UserCountry } from 'src/data/entities/user-country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, UserRole, Country, UserCountry]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
