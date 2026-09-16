import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  Pending = 'pending',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Refunded = 'refunded',
}

registerEnumType(PaymentStatus, { name: 'PaymentStatus' });
