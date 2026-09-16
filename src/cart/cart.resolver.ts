import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { AddCartItemInput } from './dto/add-cart-item.input.js';
import { UpdateCartItemInput } from './dto/update-cart-item.input.js';
import { CartType } from './type/cart.type.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { JwtUser } from '../auth/current-user.decorator.js';

@UseGuards(AuthGuard)
@Resolver(() => CartType)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartType, { name: 'myCart' })
  myCart(@CurrentUser() user: JwtUser): Promise<CartType> {
    return this.cartService.getCart(user.sub);
  }

  @Mutation(() => CartType)
  addToCart(
    @CurrentUser() user: JwtUser,
    @Args('addCartItemInput') addCartItemInput: AddCartItemInput,
  ): Promise<CartType> {
    return this.cartService.addItem(user.sub, addCartItemInput);
  }

  @Mutation(() => CartType)
  updateCartItem(
    @CurrentUser() user: JwtUser,
    @Args('updateCartItemInput') updateCartItemInput: UpdateCartItemInput,
  ): Promise<CartType> {
    return this.cartService.updateItem(user.sub, updateCartItemInput);
  }

  @Mutation(() => CartType)
  removeFromCart(
    @CurrentUser() user: JwtUser,
    @Args('productId') productId: string,
  ): Promise<CartType> {
    return this.cartService.removeItem(user.sub, productId);
  }
}
