import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequestFromContext } from './execution-context.util.js';
import { Role } from './roles.enum.js';

export interface JwtUser {
  sub: string;
  email: string;
  role: Role;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser => {
    return getRequestFromContext(context).user;
  },
);
