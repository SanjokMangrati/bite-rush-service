import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { UserJwtPayload } from 'lib/types/user.types';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from 'src/data/entities/payment-method.entity';
import { RoleType } from 'src/data/entities/role.entity';
import { decrypt, encrypt } from 'lib/helper';
import { PermissionEnum } from 'src/data/entities/permission.entity';

@Injectable()
export class PaymentMethodsService {
  private readonly encryptionKey: Buffer;
  private readonly encryptionIv: Buffer;

  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    const key = this.configService.get<string>('ENCRYPTION_KEY');
    const iv = this.configService.get<string>('ENCRYPTION_IV');
    if (!key || key.length !== 64) {
      throw new Error(
        'ENCRYPTION_KEY must be a 32-byte hex string (64 characters).',
      );
    }
    if (!iv || iv.length !== 32) {
      throw new Error(
        'ENCRYPTION_IV must be a 16-byte hex string (32 characters).',
      );
    }
    this.encryptionKey = Buffer.from(key, 'hex');
    this.encryptionIv = Buffer.from(iv, 'hex');
  }

  async listUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    const methods = await this.paymentMethodRepository.find({
      where: { user: { id: userId } },
    });
    if (!methods || methods.length === 0) {
      throw new NotFoundException('No payment methods found for the user.');
    }
    return methods.map((method) => {
      return {
        ...method,
        card_number: decrypt(
          method.card_number,
          this.encryptionKey,
          this.encryptionIv,
        ),
        cvv: decrypt(method.cvv, this.encryptionKey, this.encryptionIv),
      };
    });
  }

  async createPaymentMethod(
    createDto: CreatePaymentMethodDto,
    userPayload: UserJwtPayload,
  ): Promise<PaymentMethod> {
    const user = await this.usersService.findById(userPayload.sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const encryptedCardNumber = encrypt(
      createDto.card_number,
      this.encryptionKey,
      this.encryptionIv,
    );
    const encryptedCvv = encrypt(
      createDto.cvv,
      this.encryptionKey,
      this.encryptionIv,
    );

    const paymentMethod = this.paymentMethodRepository.create({
      type: createDto.type,
      card_number: encryptedCardNumber,
      cardholder_name: createDto.cardholder_name,
      expiry_date: createDto.expiry_date,
      cvv: encryptedCvv,
      is_default: createDto.is_default || false,
      user: { id: user.id } as any,
    });
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async updatePaymentMethod(
    id: string,
    updateDto: UpdatePaymentMethodDto,
    userPayload: UserJwtPayload,
  ): Promise<PaymentMethod> {
    const hasUpdatePermission = await this.usersService.hasPermission(
      userPayload.sub,
      PermissionEnum.UPDATE_PAYMENT,
    );
    if (!hasUpdatePermission) {
      throw new UnauthorizedException(
        'User does not have permission to update payment methods.',
      );
    }
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id },
    });
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    if (updateDto.card_number) {
      updateDto.card_number = encrypt(
        updateDto.card_number,
        this.encryptionKey,
        this.encryptionIv,
      );
    }
    if (updateDto.cvv) {
      updateDto.cvv = encrypt(
        updateDto.cvv,
        this.encryptionKey,
        this.encryptionIv,
      );
    }
    Object.assign(paymentMethod, updateDto);
    return this.paymentMethodRepository.save(paymentMethod);
  }
}
