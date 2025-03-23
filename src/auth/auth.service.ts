import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshDto } from './dto/refresh.dto';
import { UserSession } from 'src/data/entities/user-session.entity';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    return await this.sessionRepository.manager.transaction(
      async (manager: EntityManager) => {
        const { email, password } = loginDto;
        const user = await this.validateUser(email, password);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }

        await manager.delete(UserSession, { user: { id: user.id } });

        const payload = {
          sub: user.id,
          email: user.email,
          roles: user.userRoles ? user.userRoles.map((ur) => ur.role.name) : [],
        };

        const accessToken = this.jwtService.sign(payload);

        const rawRefreshToken = this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        });

        const hashedRefreshToken = await bcrypt.hash(rawRefreshToken, 10);

        const expiresInMs = parseInt(
          this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN_MS'),
        );
        const expiresAt = new Date(Date.now() + expiresInMs);

        const session = manager.create(UserSession, {
          user,
          refreshToken: hashedRefreshToken,
          expiresAt,
        });
        await manager.save(session);

        return { accessToken, refreshToken: rawRefreshToken };
      },
    );
  }

  async refreshToken(refreshDto: RefreshDto) {
    const { userId, refreshToken } = refreshDto;
    const session = await this.sessionRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!session) {
      throw new NotFoundException('Refresh token not found');
    }
    const isMatch = await bcrypt.compare(refreshToken, session.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.userRoles ? user.userRoles.map((ur) => ur.role.name) : [],
    };
    const newAccessToken = this.jwtService.sign(payload);
    return { accessToken: newAccessToken };
  }

  async logout(userId: string) {
    await this.sessionRepository.delete({ user: { id: userId } });
    return { message: 'Logged out successfully' };
  }
}
