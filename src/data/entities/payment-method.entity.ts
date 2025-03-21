import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { User } from './user.entity';

export enum PaymentType {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
}

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User, (user) => user.paymentMethods, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'type', type: 'enum', enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @Column({ name: 'card_number', type: 'varchar', length: 255 })
  @IsString()
  card_number: string; // Encrypted

  @Column({ name: 'cardholder_name', type: 'varchar', length: 255 })
  @IsString()
  cardholder_name: string;

  @Column({ name: 'expiry_date', type: 'varchar', length: 10 })
  @IsString()
  expiry_date: string;

  @Column({ name: 'cvv', type: 'smallint' })
  @IsNumber()
  cvv: number;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  @IsBoolean()
  is_default: boolean;
}
