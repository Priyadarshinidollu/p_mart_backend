import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from './order.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Relation<Order>;

  @Column()
  orderId: string;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  @Column('int')
  quantity: number;

  /** Snapshot of the product price at purchase time, so later price changes don't rewrite history. */
  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: string;
}
