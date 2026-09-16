import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';
import { PaymentStatus } from '../enums/payment-status.enum.js';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @Column({ default: 'stripe' })
  provider: string;

  @Column({ nullable: true })
  stripePaymentIntentId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Column()
  currency: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
