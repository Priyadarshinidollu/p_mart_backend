import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
