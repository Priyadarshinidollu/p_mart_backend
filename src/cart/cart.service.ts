import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';
import { AddCartItemInput } from './dto/add-cart-item.input.js';
import { UpdateCartItemInput } from './dto/update-cart-item.input.js';
import { CartType } from './type/cart.type.js';
import { CartItemType } from './type/cart-item.type.js';
import { ProductsService } from '../products/products.service.js';
import { toProductType } from '../products/products.mapper.js';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemsRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartsRepository.findOne({ where: { userId } });

    if (!cart) {
      cart = await this.cartsRepository.save(this.cartsRepository.create({ userId, items: [] }));
    }

    return cart;
  }

  async getCart(userId: string): Promise<CartType> {
    const cart = await this.getOrCreateCart(userId);

    return this.toCartType(cart);
  }

  async addItem(userId: string, input: AddCartItemInput): Promise<CartType> {
    if (input.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    const product = await this.productsService.findOne(input.productId);
    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.items.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += input.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      await this.cartItemsRepository.save(
        this.cartItemsRepository.create({ cartId: cart.id, productId: product.id, quantity: input.quantity }),
      );
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, input: UpdateCartItemInput): Promise<CartType> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((cartItem) => cartItem.productId === input.productId);

    if (!item) {
      throw new NotFoundException(`Product "${input.productId}" is not in the cart`);
    }

    if (input.quantity < 1) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    item.quantity = input.quantity;
    await this.cartItemsRepository.save(item);

    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartType> {
    const cart = await this.getOrCreateCart(userId);
    const item = cart.items.find((cartItem) => cartItem.productId === productId);

    if (!item) {
      throw new NotFoundException(`Product "${productId}" is not in the cart`);
    }

    await this.cartItemsRepository.remove(item);

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);

    if (cart.items.length > 0) {
      await this.cartItemsRepository.remove(cart.items);
    }
  }

  private toCartType(cart: Cart): CartType {
    const items: CartItemType[] = cart.items.map((item) => ({
      id: item.id,
      product: toProductType(item.product),
      quantity: item.quantity,
    }));

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return { id: cart.id, items, total };
  }
}
