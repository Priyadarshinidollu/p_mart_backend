import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrderType } from './type/order.type.js';
import { OrderItemType } from './type/order-item.type.js';
import { toProductType } from '../products/products.mapper.js';

function toOrderItemType(item: OrderItem): OrderItemType {
  return {
    id: item.id,
    product: toProductType(item.product),
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice),
  };
}

export function toOrderType(order: Order): OrderType {
  return {
    id: order.id,
    items: order.items.map(toOrderItemType),
    totalAmount: Number(order.totalAmount),
    shippingAddress: order.shippingAddress,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
