import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/data/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Country } from 'src/data/entities/country.entity';
import { Role, RoleType } from 'src/data/entities/role.entity';
import { UserCountry } from 'src/data/entities/user-country.entity';
import { UserRole } from 'src/data/entities/user-role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,

    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,

    @InjectRepository(UserCountry)
    private readonly userCountryRepository: Repository<UserCountry>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.manager.transaction(
      async (manager: EntityManager) => {
        const { email, name, password, role, country } = createUserDto;

        const existing = await manager.findOne(User, { where: { email } });
        if (existing) {
          throw new BadRequestException(
            `User with email ${email} already exists`,
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = manager.create(User, {
          email,
          name,
          password: hashedPassword,
        });
        const savedUser = await manager.save(user);

        const foundRole = await manager.findOne(Role, {
          where: { name: role },
        });
        if (!foundRole) {
          throw new BadRequestException(`Role ${role} is not supported.`);
        }

        const userRole = manager.create(UserRole, {
          user: savedUser,
          role: foundRole,
        });
        await manager.save(userRole);

        if (!country) {
          throw new BadRequestException(
            'Country must be provided for non-admin users.',
          );
        }
        const foundCountry = await manager.findOne(Country, {
          where: { name: country },
        });
        if (!foundCountry) {
          throw new BadRequestException(`Country ${country} not supported`);
        }
        const userCountry = manager.create(UserCountry, {
          user: savedUser,
          country: foundCountry,
        });
        await manager.save(userCountry);

        return savedUser;
      },
    );
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateResult = await this.userRepository.update(id, updateUserDto);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.findById(id);
  }
}
