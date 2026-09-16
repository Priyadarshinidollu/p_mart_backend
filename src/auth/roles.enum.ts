import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  Customer = 'customer',
  Admin = 'admin',
}

registerEnumType(Role, { name: 'Role' });
