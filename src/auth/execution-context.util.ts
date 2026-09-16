import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export function getRequestFromContext(context: ExecutionContext): any {
  if (context.getType<'graphql'>() === 'graphql') {
    return GqlExecutionContext.create(context).getContext().req;
  }

  return context.switchToHttp().getRequest();
}
