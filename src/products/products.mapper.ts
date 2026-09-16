import { Product } from './entities/product.entity.js';
import { ProductType } from './type/product.type.js';

export function toProductType(product: Product): ProductType {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    stock: product.stock,
    imageUrl: product.imageUrl,
    isActive: product.isActive,
    category: product.category ?? undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
