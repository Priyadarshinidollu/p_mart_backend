import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrderStatus } from './enums/order-status.enum.js';
import { CheckoutInput } from './dto/checkout.input.js';
import { CartService } from '../cart/cart.service.js';
import { ProductsService } from '../products/products.service.js';
import { Role } from '../auth/roles.enum.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly cartService: CartService,
    private readonly productsService: ProductsService,
  ) {}

  async checkout(userId: string, input: CheckoutInput): Promise<Order> {
    const cart = await this.cartService.getOrCreateCart(userId);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout an empty cart');
    }

    const order = await this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const cartItem of cart.items) {
        const product = await this.productsService.decrementStock(manager, cartItem.productId, cartItem.quantity);
        const unitPrice = Number(product.price);
        totalAmount += unitPrice * cartItem.quantity;

        orderItems.push(
          manager.create(OrderItem, {
            productId: product.id,
            quantity: cartItem.quantity,
            unitPrice: unitPrice.toFixed(2),
          }),
        );
      }

      const newOrder = manager.create(Order, {
        userId,
        items: orderItems,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress: input.shippingAddress,
        status: OrderStatus.Pending,
      });

      return manager.save(newOrder);
    });

    await this.cartService.clearCart(userId);

    return order;
  }

  findAllForUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  findAllAdmin(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, requester: { sub: string; role: Role }): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    if (requester.role !== Role.Admin && order.userId !== requester.sub) {
      throw new ForbiddenException('You do not have access to this order');
    }

    return order;
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with id "${orderId}" not found`);
    }

    order.status = status;

    return this.ordersRepository.save(order);
  }

  async findOneById(orderId: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException(`Order with id "${orderId}" not found`);
    }

    return order;
  }
}
