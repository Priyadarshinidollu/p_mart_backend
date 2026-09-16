import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CheckoutInput } from './dto/checkout.input.js';
import { UpdateOrderStatusInput } from './dto/update-order-status.input.js';
import { OrderType } from './type/order.type.js';
import { toOrderType } from './orders.mapper.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { Role } from '../auth/roles.enum.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/current-user.decorator.js';

@UseGuards(AuthGuard)
@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => OrderType)
  async checkout(
    @CurrentUser() user: JwtUser,
    @Args('checkoutInput') checkoutInput: CheckoutInput,
  ): Promise<OrderType> {
    return toOrderType(await this.ordersService.checkout(user.sub, checkoutInput));
  }

  @Query(() => [OrderType], { name: 'myOrders' })
  async myOrders(@CurrentUser() user: JwtUser): Promise<OrderType[]> {
    const orders = await this.ordersService.findAllForUser(user.sub);

    return orders.map(toOrderType);
  }

  @Query(() => OrderType, { name: 'order' })
  async findOne(@CurrentUser() user: JwtUser, @Args('id') id: string): Promise<OrderType> {
    return toOrderType(await this.ordersService.findOne(id, user));
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Query(() => [OrderType], { name: 'orders' })
  async findAllAdmin(): Promise<OrderType[]> {
    const orders = await this.ordersService.findAllAdmin();

    return orders.map(toOrderType);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @Mutation(() => OrderType)
  async updateOrderStatus(
    @Args('updateOrderStatusInput') updateOrderStatusInput: UpdateOrderStatusInput,
  ): Promise<OrderType> {
    return toOrderType(
      await this.ordersService.updateStatus(
        updateOrderStatusInput.orderId,
        updateOrderStatusInput.status,
      ),
    );
  }
}
